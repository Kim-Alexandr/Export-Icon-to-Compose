import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'code.js', // точка входа – ваш основной файл с кодом
  output: {
    file: 'bundle.js', // итоговый файл, который будет использовать плагин
    format: 'iife',    // формат IIFE подходит для работы в браузере / Figma
    name: 'pluginBundle'
  },
  plugins: [resolve(), commonjs()]
};