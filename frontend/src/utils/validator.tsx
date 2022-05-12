import { HTMLAttributeAnchorTarget } from "react";

// TODO: Actually Write an validator
const validator = {
    noSpace: (value: string) => {
        return value.replace(/\s/g, "_");
    },
    name: (target: any) => {
        return validator.stringConstraint(target, 50);
    },
    description: (target: any) =>{
        return validator.stringConstraint(target, 500);
    },
    cirName: (target: any) => {
        return validator.noSpace(validator.stringConstraint(target, 50));
    },
    command: (target: any) => {
        return validator.stringConstraint(target, 50); 
    },
    output: (target: any) => {
        return validator.stringConstraint(target, 100);
    },
    stringConstraint: (target: any, maxLen: number) => {
        let value = target.value;
        // Check if the last character is a space
        if (value.length > maxLen) {
            // Add a class to target
            target.classList.add("is-invalid");
            // Trim the value
            value = value.substring(0, maxLen);
        }else{
            target.classList.remove("is-invalid");
        }
        return value;
    },
    statValues: (stat: string) => {
        return validator.numberConstraint(stat, 1, 1000000);
    },
    numberConstraint: (number: string, min: number, max: number) => {
        if (number === "") return "";
        if (isNaN(Number(number))) return min;
        if (!isFinite(Number(number))) return max;
        let parsedNumber = parseInt(number);
        return Math.max(min, Math.min(parsedNumber, max));
    },
    maxPlayers: (maxPlayersString: string) => {
        return validator.numberConstraint(maxPlayersString, 1, 1000000);
    },
    alreadyExists(value: any, key:string, list: any[] | {[key: string]: any}) {
        if (Array.isArray(list)) {
        return list.find(item => item[key] === value);
        }else{
            return Object.keys(list).find(listkey => list[listkey][key] === value);
        }
    },
    isEmpty: (value: string, ...othervalues: string[]) => {
        return value === '';

    },
    isZero: (value: number, ...otherValues: number[]) => {
        return value === 0;
    },
    /**
     * 
     * @param value The value to check
     * @param failValue The value to return if the check fails
     * @returns The validated number
     */
    positiveInteger(value: number, failValue: number) {
        if (isNaN(value)) return failValue;
        if (!isFinite(value)) return failValue;
        if (value < 0) return failValue;
        return value;
    },

    password: (password:string, confirm:string) => {
        
        let returns = [];
        // Check if both passwords are the same
        if (password !== confirm) returns.push("password.nomatch");

        // Check if password is at least 8 characters long
        if (password.length < 8) returns.push("password.tooshort");
        
        // Check if password contains a numeral
        if (!/[0-9]/.test(password)) returns.push("password.nonumeral");

        // Check if password contains a lowecase letter
        if (!/[a-z]/.test(password)) returns.push("password.nolower");

        // Check if password contains a capital letter
        if (!/[A-Z]/.test(password)) returns.push("password.nocapital");

        // Check if password contains a symbol
        if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) returns.push("password.nosymbol");

        return returns;

    }

}


export { validator };