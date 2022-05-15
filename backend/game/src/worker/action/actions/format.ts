export default {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    underscore: "\x1b[4m",
    italic: "\x1b[3m",
    color: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    },

    rgb: (r: number, g: number, b: number) => {
        return `\x1b[38;2;${r};${g};${b}m`
    }
};