import svgPathParser from "svg-path-parser";

const uiHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Export Compose Code</title>
  <style>
    body {
      font-family: sans-serif;
      margin: 16px;
      background-color: var(--figma-background);
    }
    h2 {
      font-size: 18px;
      margin-bottom: 8px;
    }
    textarea {
      width: 100%;
      height: 200px;
      resize: none;
      padding: 8px;
      font-size: 14px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <h2>Сгенерированный Compose код</h2>
  <textarea id="codeArea" readonly></textarea>
  <script>
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage;
      if (msg.type === "generatedCode") {
        document.getElementById("codeArea").value = msg.code;
      }
    };
  </script>
</body>
</html>`;

figma.showUI(uiHtml, { width: 500, height: 350 });

async function runPlugin() {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1) {
    figma.notify("Выберите одну иконку для экспорта");
    figma.closePlugin();
    return;
  }
  
  const iconNode = selection[0];
  if (
    iconNode.type !== "VECTOR" &&
    iconNode.type !== "FRAME" &&
    iconNode.type !== "COMPONENT" &&
    iconNode.type !== "INSTANCE"
  ) {
    figma.notify("Выбранный объект не поддерживается для экспорта");
    figma.closePlugin();
    return;
  }

  try {
    // Стандартный экспорт SVG, как при нажатии на Export SVG
    const svgBytes = await iconNode.exportAsync({ format: "SVG" });
    const svgText = decodeText(svgBytes);
    
    // Передаем выбранный узел для получения его имени и размеров.
    const composeCode = convertSvgToCompose(svgText, iconNode);
    figma.ui.postMessage({ type: "generatedCode", code: composeCode });
  } catch (error) {
    figma.notify("Ошибка экспорта: " + error);
    figma.closePlugin();
  }
}

function decodeText(buffer) {
  if (typeof TextDecoder !== "undefined") {
    return new TextDecoder().decode(buffer);
  } else {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }
}

function convertSvgToCompose(svg, node) {
  const iconName = sanitizeName(node.name);
  const defaultWidth = node.width;
  const defaultHeight = node.height;
  const viewportWidth = node.width;
  const viewportHeight = node.height;
  
  // Используем глобальное регулярное выражение для поиска всех <path> элементов
  const pathRegex = /<path\s+([^>]+?)\/?>/gi;
  let match;
  let commandsCombined = "";
  
  while ((match = pathRegex.exec(svg)) !== null) {
    const tagContent = match[1];
    const dMatch = tagContent.match(/d="([^"]+)"/i);
    let dValue = dMatch ? dMatch[1].trim() : "";
    
    const fillMatch = tagContent.match(/fill="([^"]+)"/i);
    let fillColor = fillMatch ? fillMatch[1].trim() : "#9EA9B7";
    fillColor = normalizeHexColor(fillColor);
    
    const pathCommands = dValue && dValue.length > 0 
          ? parsePathDataWithLibrary(dValue)
          : "";
    
    commandsCombined += "\n" + pathCommands;
  }
  
  if (commandsCombined.trim() === "") {
    commandsCombined = getDefaultPathCommands();
  }
  
  return `
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.PathFillType
import androidx.compose.ui.graphics.vector.ImageVector.Builder
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.unit.dp

val ${iconName}: ImageVector
    get() = Builder(
        name = "${iconName}",
        defaultWidth = ${defaultWidth.toFixed(2)}.dp,
        defaultHeight = ${defaultHeight.toFixed(2)}.dp,
        viewportWidth = ${viewportWidth.toFixed(2)}f,
        viewportHeight = ${viewportHeight.toFixed(2)}f
    ).apply {
      path(
        fill = SolidColor(Color(${normalizeHexColor("#9EA9B7")})),
        stroke = null,
        strokeLineWidth = 0.0f,
        strokeLineCap = Butt,
        strokeLineJoin = Miter,
        strokeLineMiter = 4.0f,
        pathFillType = PathFillType.EvenOdd
      ) {
${commandsCombined}
      }
    }
    .build()
`;
}

function sanitizeName(name) {
  return name.replace(/[\s\/]/g, "");
}

function normalizeHexColor(hex) {
  if (hex.toLowerCase() === "none") return "0x00000000";
  if (hex.length === 4) {
    hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  return "0xFF" + hex.slice(1).toUpperCase();
}

function getDefaultPathCommands() {
  return `        moveTo(8.0f, 15.0f)
        curveTo(11.866f, 15.0f, 15.0f, 11.866f, 15.0f, 8.0f)
        curveTo(15.0f, 4.134f, 11.866f, 1.0f, 8.0f, 1.0f)
        curveTo(4.134f, 1.0f, 1.0f, 4.134f, 1.0f, 8.0f)
        curveTo(1.0f, 11.866f, 4.134f, 15.0f, 8.0f, 15.0f)
        close()`;
}

function parsePathDataWithLibrary(d) {
  let result = "";
  let currentX = 0, currentY = 0;
  
  const commands = svgPathParser.parseSVG(d);
  
  commands.forEach(cmd => {
    let line = "";
    if (cmd.relative) {
      if (cmd.x !== undefined) cmd.x += currentX;
      if (cmd.y !== undefined) cmd.y += currentY;
      if (cmd.x1 !== undefined) cmd.x1 += currentX;
      if (cmd.y1 !== undefined) cmd.y1 += currentY;
      if (cmd.x2 !== undefined) cmd.x2 += currentX;
      if (cmd.y2 !== undefined) cmd.y2 += currentY;
    }
    switch (cmd.code.toUpperCase()) {
      case "M":
        currentX = cmd.x;
        currentY = cmd.y;
        line = `moveTo(${formatNum(cmd.x)}, ${formatNum(cmd.y)})`;
        break;
      case "L":
        currentX = cmd.x;
        currentY = cmd.y;
        line = `lineTo(${formatNum(cmd.x)}, ${formatNum(cmd.y)})`;
        break;
      case "H":
        currentX = cmd.x;
        line = `horizontalLineTo(${formatNum(cmd.x)})`;
        break;
      case "V":
        currentY = cmd.y;
        line = `verticalLineTo(${formatNum(cmd.y)})`;
        break;
      case "C":
        currentX = cmd.x;
        currentY = cmd.y;
        line = `curveTo(${formatNum(cmd.x1)}, ${formatNum(cmd.y1)}, ${formatNum(cmd.x2)}, ${formatNum(cmd.y2)}, ${formatNum(cmd.x)}, ${formatNum(cmd.y)})`;
        break;
      case "Z":
        line = "close()";
        break;
      default:
        line = `// Необработанная команда: ${cmd.code}`;
    }
    result += "        " + line + "\n";
  });
  
  return result;
}

function formatNum(n) {
  return parseFloat(n.toFixed(3)) + "f";
}

runPlugin();