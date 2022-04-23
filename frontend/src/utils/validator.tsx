
// TODO: connect supervisor to the real supervisor
const validator = {
    maxPlayers: (maxPlayersString: string) => {
        if (isNaN(Number(maxPlayersString))) return 2;
        if (!isFinite(Number(maxPlayersString)) || maxPlayersString === '') return 1000000;
        let maxPlayers = parseInt(maxPlayersString);
        return Math.max(2, Math.min(maxPlayers, 1000000));
    },
    string(target: EventTarget & HTMLInputElement, onvalid: (value: string) => void) {
        if (target.value === '' || /^[a-z0-9-\'_\.,:\(\)&\[\]\/+=\?#@ \xC0-\xFF]+$/i.test(target.value)) {
            onvalid(target.value);
            target.spellcheck = false;
        } else {
            target.spellcheck = true;
            target.focus();
        }
    },
    isEmpty: (value: string, ...othervalues: string[]) => {
        return value === '';

    },
    isZero: (value: number, ...otherValues: number[]) => {
        return value === 0;

    }

}


export { validator };