const fs = require('fs');
const path = require('path');

// 读取文件函数
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// 写入文件函数
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// 递归获取目录下所有JSP文件（优化版本）
function getAllJspFiles(dirPath) {
  const results = [];
  
  function traverse(currentPath) {
    const files = fs.readdirSync(currentPath);
    
    for (const file of files) {
      const fullPath = path.join(currentPath, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (file.toLowerCase().endsWith('.jsp')) {
        results.push(fullPath);
      }
    }
  }
  
  traverse(dirPath);
  return results;
}

// 创建目录
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 类名映射配置
const CLASS_MAPPINGS = {
  form: {
    'panel panel-default searchTool fl': 'panel panel-default searchTool',
    'panel-body': 'z-page-search-form',
    'w110 name': 'name',
    'w140 mt8': '',
    'searchTool': 'searchTool'
  },
  table: {
    'table': 'z-page-search-componets'
  }
};

function transformJSP(oldContent) {
  // 1. 处理基础结构
  let updatedContent = oldContent;

  // 2. 分别处理 form 标签内外的内容
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/g;
  let lastIndex = 0;
  let result = '';

  // 找到所有的 form 标签
  const matches = [...updatedContent.matchAll(formRegex)];

  if (matches.length > 0) {
    matches.forEach(match => {
      const [fullMatch, formContent] = match;
      const offset = match.index;

      // 处理 form 标签之前的内容
      const beforeForm = updatedContent.slice(lastIndex, offset);
      result += transformOuterContent(beforeForm);

      // 处理 form 标签内的内容
      const transformedFormContent = transformInnerContent(formContent);
      result += fullMatch.replace(formContent, transformedFormContent);

      lastIndex = offset + fullMatch.length;
    });

    // 处理最后一个 form 标签之后的内容
    result += transformOuterContent(updatedContent.slice(lastIndex));
    updatedContent = result;
  }

  // 3. 添加页面结构
  if (!updatedContent.includes('z-page-home')) {


     // 为 form 标签添加 z-page-search 类
  updatedContent = updatedContent.replace(
    /<form([^>]*?)>/g,
    (match, attributes) => {
      if (attributes.includes('class=')) {
        return match.replace(/class="([^"]*)"/, 'class="$1 z-page-search"');
      } else {
        return match.replace('<form', '<form class="z-page-search"');
      }
    }
  );

    updatedContent = updatedContent.replace(
      '<body>',
      `<body>\n<div class="z-page-home">\n    <div class="z-page-title">仪器信息浏览</div>`
    );
  }

  // 4. 格式化代码
  updatedContent = updatedContent
    .replace(/^\s+$/gm, '')  // 删除只包含空白字符的行
    .replace(/\n{3,}/g, '\n\n')  // 将多个空行替换为一个空行
    .replace(/\t/g, '    ');  // 将制表符替换为4个空格

  return updatedContent;
}

// 转换 form 标签内的内容
function transformInnerContent(content) {
  let result = content;
  
  // 处理基本类名替换
  result = replaceClasses(result, CLASS_MAPPINGS.form);
  
  // 优化表格处理
  result = result.replace(
    /<table(?:\s+[^>]*)?>/g,
    (match) => {
      if (match.includes('class=')) {
        return match.replace(/class="([^"]*)"/, (_, cls) => 
          `class="${cls} ${CLASS_MAPPINGS.table.table}"`);
      }
      return match.replace('<table', `<table class="${CLASS_MAPPINGS.table.table}"`);
    }
  );

  return result;
}

// 转换 form 标签外的内容
function transformOuterContent(content) {
  return replaceClasses(content, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
}

// 辅助函数：替换类名
function replaceClasses(content, classMapping) {
  let result = content;
  Object.entries(classMapping).forEach(([oldClass, newClass]) => {
    const regex = new RegExp(`class="[^"]*${oldClass}[^"]*"`, 'g');
    result = result.replace(regex, `class="${newClass}"`);
  });
  return result;
}

// 主函数
async function main() {
  const inputDir = path.join(__dirname, 'dist/matched-jsp');
  const outputDir = path.join(__dirname, 'dist/output');

  try {
    // 确保输出目录存在
    ensureDirectoryExists(outputDir);

    // 获取所有JSP文件
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    // 创建一个Map来存储转换结果
    const processedFiles = new Map();

    // 处理每个JSP文件
    for (const filePath of jspFiles) {
      // 计算相对路径
      const relativePath = path.relative(inputDir, filePath);
      const outputPath = path.join(outputDir, relativePath);
      
      try {
        // 确保输出文件的目录结构存在
        ensureDirectoryExists(path.dirname(outputPath));

        // 读取并转换文件内容
        const oldContent = readFile(filePath);
        const transformedContent = transformJSP(oldContent);
        
        // 写入转换后的文件
        writeFile(outputPath, transformedContent);
        
        // 记录处理结果
        processedFiles.set(relativePath, true);
        console.log(`✓ 已转换: ${relativePath}`);
      } catch (err) {
        console.error(`× 转换失败: ${relativePath}`, err.message);
        processedFiles.set(relativePath, false);
      }
    }

    // 输出处理结果统计
    const totalFiles = processedFiles.size;
    const successFiles = [...processedFiles.values()].filter(Boolean).length;
    
    console.log('\n转换完成！');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功转换: ${successFiles}`);
    console.log(`失败数量: ${totalFiles - successFiles}`);
    console.log(`输出目录: ${outputDir}`);
    
  } catch (error) {
    console.error('处理过程中发生错误：', error);
  }
}

main();