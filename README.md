# Export Icon to Compose

### Описание

Плагин **Export Icon to Compose** предназначен для экспорта выбранного векторного объекта из Figma в формате SVG и преобразования его в код Jetpack Compose для Android. Плагин автоматически извлекает имя и размеры выбранного объекта, а затем анализирует SVG (включая все элементы `<path>`) для генерации DSL-команд, подходящих для создания `ImageVector` в Jetpack Compose.

### Возможности

- Экспорт выбранного объекта в формате SVG (аналог функции Export SVG в Figma).
- Автоматическое извлечение имени и размеров (ширина, высота, viewport) из выбранного узла.
- Обработка всех основных тегов `<path>` для генерации DSL-команд.
- Генерация полностью рабочего кода Jetpack Compose, готового для использования в Android-проектах.

### Установка и сборка (WIP)

---

### Description

The **Export Icon to Compose plugin** exports a selected vector object from Figma as an SVG and converts it into Jetpack Compose code for Android. The plugin automatically extracts the node’s name and dimensions, then parses the SVG (including all <path> elements) to generate DSL commands suitable for constructing an ImageVector in Jetpack Compose.

Features
- Exports the selected object in SVG format (similar to Figma’s “Export SVG” feature).
- Automatically extracts the node’s name and dimensions (width, height, viewport).
- Processes all main <path> elements to generate DSL commands.
- Generates fully functional Jetpack Compose code, ready for use in Android projects.

### Install (WIP)

---

License

This project is licensed under the MIT License.

MIT License (English)

MIT License

Copyright (c) 2025 Alexandr Kim

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

