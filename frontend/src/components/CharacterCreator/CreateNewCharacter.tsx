
/**
 * @module CreateNewCharacter
 * @category React Components
 * @description Component to create a new character
 * @props {@linkcode CreateNewCharacterProps}
 */

import React, { FormEvent } from 'react';
import { supervisor } from 'src/services/supervisor';
import { CreateCharacterRequest, GetCharacterAttributesResponse } from 'src/types/supervisor';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from 'src/hooks/useGame';

export interface CreateNewCharacterProps extends GetCharacterAttributesResponse {
    onCreate: () => void
}

interface PropValues { id: string; name: string; description: string }
const CreateNewCharacter: React.FC<CreateNewCharacterProps> = ({ classes, genders, species, onCreate }) => {

    const auth = useAuth();
    const game = useGame();

    const onCreateCharacter = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        let formData = new FormData(evt.currentTarget);
        let bodyData: CreateCharacterRequest = {
            user: auth.user,
            authToken: auth.token,
            characterData: {
                name: formData.get("name") as string,
                fullname: formData.get("fullname") as string,
                class: formData.get("class") as string,
                species: formData.get("species") as string,
                gender: formData.get("gender") as string
            }
        }
        supervisor.createCharacter(game.dungeon, bodyData, (data) => {
            onCreate();
        }, (error) => {
            alert(error);
        })

    }

    return (
        <form onSubmit={onCreateCharacter}>
            <h1>Neuen Charakter anlegen</h1>
            <input required type="text" name="name" placeholder="Name" />
            <input required type="text" name="fullname" placeholder="Fullname" />
            <label>
                Class: <select name="class">
                    {classes.map((cl, index) => {
                        return (
                            <option key={index} value={cl.id}>{cl.name}</option>
                        )
                    })}
                </select>
                Genders: <select name="gender">
                    {genders.map((cl, index) => {
                        return (
                            <option key={index} value={cl.id}>{cl.name}</option>
                        )
                    })}
                </select>
                Species: <select name="species">
                    {species.map((cl, index) => {
                        return (
                            <option key={index} value={cl.id}>{cl.name}</option>
                        )
                    })}
                </select>
            </label>
            <button type="submit">Create and Join</button>
        </form>
    )
}

export default CreateNewCharacter;