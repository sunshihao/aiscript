const fs = require('fs');
const path = require('path');

// ==================== 基础文件操作函数 ====================

// 读取文件函数
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// 写入文件函数
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}

// 创建目录
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// 递归获取目录下所有JSP文件
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

// ==================== 处理HTML标签的属性内容和属性值 ====================

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

// 替换类名
function replaceClasses(content, classMapping) {
  let result = content;

  Object.entries(classMapping).forEach(([oldClass, newClass]) => {
    // 特殊处理 panel-body 类，当包含 padding-0 时不转换
    if (oldClass === 'panel-body') {
      const panelBodyRegex = /class="([^"]*panel-body[^"]*?)"/g;
      result = result.replace(panelBodyRegex, (match, classContent) => {
        // 如果包含 padding-0，则不进行转换
        if (classContent.includes('padding-0')) {
          return match;
        }
        // 否则进行正常转换
        return `class="${newClass}"`;
      });
    } else {
      // 其他类名正常处理
      const regex = new RegExp(`class="[^"]*${oldClass}[^"]*"`, 'g');
      result = result.replace(regex, `class="${newClass}"`);
    }
  });
  return result;
}

// 处理表格内容
function processTableContent(content) {
  // 处理表格中的tr内容
  return content.replace(
    /<tr[^>]*>([\s\S]*?)<\/tr>/gi,
    (trMatch) => {
      return processTrContent(trMatch);
    }
  );
}

// 处理tr内容
function processTrContent(trContent) {
  // 匹配包含name类的span的td和它的下一个td
  const pattern = /<td[^>]*>(?:\s*)<span[^>]*class="[^"]*name[^"]*"[^>]*>(.*?)<\/span>(?:\s*)<\/td>(?:\s*)<td[^>]*>([\s\S]*?)<\/td>/gi;
  
  let result = trContent.replace(pattern, (match, spanContent, nextTdContent) => {
    // 清理和格式化内容
    spanContent = spanContent.trim();
    nextTdContent = nextTdContent.trim();
    
    // 如果span内容不以冒号结束，添加冒号
    if (!spanContent.endsWith(':')) {
      spanContent += ':';
    }
    
    // 处理select标签中的-请选择-选项
    if (nextTdContent.includes('<select')) {
      nextTdContent = nextTdContent.replace(
        /<option[^>]*>-请选择-<\/option>/g,
        '<option value="">请选择</option>'
      );
    }
    
    // 构建新的TD
    return `<td>
                            <span class="name">${spanContent}</span>
                            ${nextTdContent}
                        </td>`;
  });
  
  // 处理radio类型的input
  result = result.replace(
    /<td[^>]*>(?=[\s\S]*?<input[^>]*type="radio"[^>]*>)([\s\S]*?)<\/td>/gi,
    (tdContent) => {
      // 检查td是否已经包含z-radio div
      if (!tdContent.includes('class="z-radio"')) {
        // 提取td标签的开始和结束部分
        const tdStart = tdContent.match(/^<td[^>]*>/)[0];
        const tdEnd = '</td>';
        // 获取td的内部内容
        const tdInner = tdContent.replace(/^<td[^>]*>|<\/td>$/g, '');
        
        // 提取所有radio类型的input
        const radioInputs = tdInner.match(/<input[^>]*type="radio"[^>]*>/g) || [];
        // 将所有radio inputs合并到一个z-radio div中
        const radioContent = radioInputs.length > 0 ? 
          tdInner.replace(
            new RegExp(radioInputs.map(input => input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g'),
            '<div class="z-radio">' + radioInputs.join('') + '</div>'
          ) : tdInner;
        
        return `${tdStart}${radioContent}${tdEnd}`;
      }
      return tdContent;
    }
  );
  
  return result;
}

// 处理表格属性
function processTableAttributes(content) {
  // 优化表格处理
  return content.replace(
    /<table(?:\s+[^>]*)?>/g,
    (match) => {
      if (match.includes('class=')) {
        return match.replace(/class="([^"]*)"/, (_, cls) => 
          `class="${cls} ${CLASS_MAPPINGS.table.table}"`);
      }
      return match.replace('<table', `<table class="${CLASS_MAPPINGS.table.table}"`);
    }
  );
}

// 处理input标签的class属性
function processInputClasses(content) {
  return content.replace(
    /<input[^>]*class="[^"]*"[^>]*>/gi,
    (match) => {
      // 提取class属性值
      const classMatch = match.match(/class="([^"]*)"/i);
      if (!classMatch) return match;
      
      const classValue = classMatch[1];
      // 移除以w开头后跟数字的class值
      const newClassValue = classValue
        .split(/\s+/)
        .filter(cls => !(/^w\d+$/.test(cls)))
        .join(' ')
        .trim();
      
      if (newClassValue === '') {
        // 如果class值为空，则删除整个class属性
        return match.replace(/\s+class="[^"]*"/i, '');
      } else {
        // 否则更新class值
        return match.replace(/class="[^"]*"/i, `class="${newClassValue}"`);
      }
    }
  );
}

// 为按钮添加z-btn-primary类
function addPrimaryButtonClass(content) {
  return content.replace(
    /<input[^>]*type="button"[^>]*value="([^"]*)"[^>]*>/gi,
    (match, value) => {
      // 如果value不是"重置"，添加z-btn-primary类
      if (value.trim().toLowerCase() !== '重置') {
        if (match.includes('class=')) {
          // 如果已经有class属性，检查是否已包含z-btn-primary
          if (!match.includes('z-btn-primary')) {
            return match.replace(/class="([^"]*)"/, 'class="$1 z-btn-primary"');
          }
        } else {
          // 如果没有class属性，添加一个
          return match.replace('<input', '<input class="z-btn-primary"');
        }
      }
      return match;
    }
  );
}

// 替换页面标题
function replacePageTitle(content) {
  // 提取title标签中的内容
  const titleMatch = content.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) return content;
  
  const titleContent = titleMatch[1].trim();
  
  // 查找并替换z-page-title div中的内容
  return content.replace(
    /<div\s+class="z-page-title">(.*?)<\/div>/i,
    `<div class="z-page-title">${titleContent}</div>`
  );
}

// 转换JSP属性
function transformJSPAttributes(content) {
  // 处理页面标题
  content = replacePageTitle(content);
  
  // 为按钮添加z-btn-primary类
  content = addPrimaryButtonClass(content);
  
  // 处理input标签的class属性
  content = processInputClasses(content);
  
  // 处理form标签内外的内容
  const formRegex = /<form[^>]*>([\s\S]*?)<\/form>/g;
  let lastIndex = 0;
  let result = '';

  // 找到所有的form标签
  const matches = [...content.matchAll(formRegex)];

  if (matches.length > 0) {
    matches.forEach(match => {
      const [fullMatch, formContent] = match;
      const offset = match.index;

      // 处理form标签之前的内容
      const beforeForm = content.slice(lastIndex, offset);
      result += replaceClasses(beforeForm, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });

      // 处理form标签内的内容
      let transformedFormContent = replaceClasses(formContent, CLASS_MAPPINGS.form);
      transformedFormContent = processTableAttributes(transformedFormContent);
      transformedFormContent = processTableContent(transformedFormContent);
      
      result += fullMatch.replace(formContent, transformedFormContent);

      lastIndex = offset + fullMatch.length;
    });

    // 处理最后一个form标签之后的内容
    result += replaceClasses(content.slice(lastIndex), { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
  } else {
    // 如果没有form标签，处理整个内容
    result = replaceClasses(content, { ...CLASS_MAPPINGS.form, ...CLASS_MAPPINGS.table });
    result = processTableAttributes(result);
    result = processTableContent(result);
  }

  return result;
}

// ==================== 主函数 ====================

async function main() {
  // 定义处理路径
  const inputDir = path.join(__dirname, './dist/structure-output');
  const outputDir = path.join(__dirname, './dist/final-output');

  try {
    // 确保输出目录存在
    ensureDirectoryExists(outputDir);

    // 获取所有JSP文件
    const jspFiles = getAllJspFiles(inputDir);
    
    if (jspFiles.length === 0) {
      console.log('未找到JSP文件！');
      return;
    }

    console.log(`找到 ${jspFiles.length} 个JSP文件，开始处理属性...`);
    
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
        const originalContent = readFile(filePath);
        const transformedContent = transformJSPAttributes(originalContent);
        
        // 写入转换后的文件
        writeFile(outputPath, transformedContent);
        
        // 记录处理结果
        processedFiles.set(relativePath, true);
        console.log(`✓ 已处理属性: ${relativePath}`);
      } catch (err) {
        console.error(`× 处理属性失败: ${relativePath}`, err.message);
        processedFiles.set(relativePath, false);
      }
    }

    // 输出处理结果统计
    const totalFiles = processedFiles.size;
    const successFiles = [...processedFiles.values()].filter(Boolean).length;
    
    console.log('\n属性处理完成！');
    console.log(`总文件数: ${totalFiles}`);
    console.log(`成功处理: ${successFiles}`);
    console.log(`失败数量: ${totalFiles - successFiles}`);
    console.log(`输出目录: ${outputDir}`);
    
  } catch (error) {
    console.error('处理过程中发生错误：', error);
  }
}

// 执行主函数
main();