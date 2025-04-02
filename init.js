const fs = require('fs');
const path = require('path');

// 配置目标目录路径
const CONFIG = {
	targetDirectory: '/Users/ssh/Home/workspace/ZKY/demo-ai/demo', // 扫描目录
	outputDirectory: '/Users/ssh/Home/workspace/ZKY/demo-ai/dist/matched-jsp' // 匹配文件的复制目标目录
};

// 存储结果的数组
const results = [];

// 递归遍历目录
function walkDir(dir) {
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			walkDir(filePath);
		} else if (path.extname(file).toLowerCase() === '.jsp' && !file.includes('-old')) {
			checkJspStructure(filePath);
		}
	});
}

// 检查JSP文件结构
function checkJspStructure(filePath) {
	try {
		let content = fs.readFileSync(filePath, 'utf8');
		
		// 检查是否已经包含z-开头的类名
		const hasZClass = /<[^>]*class="[^"]*z-[^"]*"[^>]*>/i.test(content);
		
		// 如果包含z-开头的类名，则跳过此文件，不进行后续处理
		if (hasZClass) {
			console.log(`跳过已包含z-class的文件: ${filePath}`);
			return; // 直接返回，不添加到结果列表
		}

		// 原有的form和panel检查逻辑
		const formMatch = /<form[^>]*>/i.exec(content);
		const panelMatch = /<div[^>]*class="[^"]*panel\s+panel-default[^"]*"[^>]*>/i.exec(content);

		if (formMatch && panelMatch) {
			const formIndex = formMatch.index;
			const panelIndex = panelMatch.index;

			if (formIndex < panelIndex) {
				results.push({
					path: filePath,
					filename: path.basename(filePath),
					directory: path.dirname(filePath)
				});
			}
		}
	} catch (err) {
		console.error(`Error processing file ${filePath}:`, err);
	}
}

// 复制文件并保持目录结构
function copyFileWithStructure(sourcePath, sourceRoot) {
	const relativePath = path.relative(sourceRoot, sourcePath);
	const targetPath = path.join(CONFIG.outputDirectory, relativePath);
	const targetDir = path.dirname(targetPath);

	// 确保目标目录存在
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, { recursive: true });
	}

	// 复制文件
	fs.copyFileSync(sourcePath, targetPath);
	console.log(`Copied: ${sourcePath} -> ${targetPath}`);
}

// 将结果写入文件
function writeResults() {
    // 获取当前日期
    const date = new Date();
    const dateStr = date.getFullYear() +
        String(date.getMonth() + 1).padStart(2, '0') +
        String(date.getDate()).padStart(2, '0');
    
    // 获取扫描目录名
    const scanDirName = path.basename(CONFIG.targetDirectory);
    
    // 构造日志目录路径
    const logDir = path.join(path.dirname(CONFIG.outputDirectory), 'log');
    // 构造日志文件名
    const logFileName = `jsp-structure-${dateStr}-${scanDirName}.txt`;
    const logPath = path.join(logDir, logFileName);
    
    // 确保日志目录存在
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const output = results
        .map(
            (result) =>
                `File: ${result.filename}\nDirectory: ${result.directory}\nFull Path: ${result.path}\n-------------------\n`
        )
        .join('\n');

    fs.writeFileSync(logPath, output, 'utf8');
    console.log(`Results have been written to ${logPath}`);
    console.log(`Total files found: ${results.length}`);

    // 创建输出目录
    if (!fs.existsSync(CONFIG.outputDirectory)) {
        fs.mkdirSync(CONFIG.outputDirectory, { recursive: true });
    }

    // 复制匹配的文件
    results.forEach((result) => {
        copyFileWithStructure(result.path, CONFIG.targetDirectory);
    });
}

// 主函数
function main() {
	const targetDir = CONFIG.targetDirectory;

	if (!fs.existsSync(targetDir)) {
		console.error('指定的目录不存在：', targetDir);
		process.exit(1);
	}

	console.log('开始扫描目录...');
	walkDir(targetDir);
	writeResults();
}

main();
