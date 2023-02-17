import fs from "fs"; // used to import files
import path from "path";
import matter from "gray-matter";
import marked from "marked";
import mkdirp from "mkdirp";

// function for file management
const readFile = filename => {
    const rawFile = fs.readFileSync(filename, "utf8")
    const parsed = matter(rawFile)
    const html = marked(parsed.content)

    return { ...parsed, html }
}

// importing template
const template = fs.readFileSync(path.resolve(), "src/template.html")

// function for use the imported template
const templatize = (template, { content, date, title }) =>
    template
        .replace(/<!-- CONTENT -->/g, content)
        .replace(/<!-- PUBLISH_DATE -->/g, date)
        .replace(/<!-- TITLE -->/g, title)

// function to save the file
const saveFile = (filename, content) => {
    const dir = path.dirname(filename)
    mkdirp.sync(dir)
    fs.writeFileSync(filename, content)
}

// function to save files in the dist folder,
// To achieve this the path is changed from src to dist
const getOutputFilename = (filename, outPath) => {
    const basename = path.basename(filename) //strips of directory path
    const newFilename = basename.substring(0, basename.length - 3) + ".html"
    const outFile = path.join(outPath, newFilename) // full path
    return outFile
}


const outPath = path.join(path.resolve(), "dist")
const outFile = getOutputFilename(filename, outPath)
const filename = path.join(path.resolve(), "src/pages/index.md")

const output = readFile(filename, "utf8")
const templatized = templatize(template, { date: output.data.date, title: output.data.title, content: output.content,})

// saving file
saveFile()