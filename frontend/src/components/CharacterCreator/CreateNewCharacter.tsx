
/**
 * @module CreateNewCharacter
 * @category React Components
 * @description Component to create a new character
 * @props {@linkcode CreateNewCharacterProps}
 */

import React, { FormEvent, useState } from 'react';
import { supervisor } from 'src/services/supervisor';
import { CreateCharacterRequest, GetCharacterAttributesResponse } from '@supervisor/api';
import { useGame } from 'src/hooks/useGame';
import { Col, Row } from 'react-bootstrap';
import MudInput from '../Custom/Input';
import MudSelect from '../Custom/Select';
import { useTranslation } from 'react-i18next';
import { SendsMessagesProps } from '../../types/misc';
import { validator } from 'src/utils/validator';

export interface CreateNewCharacterProps extends GetCharacterAttributesResponse {
    onCreate: () => void
}

const CreateNewCharacter: React.FC<CreateNewCharacterProps & SendsMessagesProps> = ({ classes, genders, species, onCreate, messageCallback }) => {

    const game = useGame();
    const {t} = useTranslation();
    const [name, setName] = useState("");

    const onCreateCharacter = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        let formData = new FormData(evt.currentTarget);
        let bodyData: CreateCharacterRequest = {
            characterData: {
                name: name,
                characterClass: formData.get("class") as string,
                characterSpecies: formData.get("species") as string,
                characterGender: formData.get("gender") as string,
                position: "0,0",
                inventory: []
            }
        }
        supervisor.createCharacter(game.dungeon, bodyData, (data) => {
            onCreate();
        }, (error) => {
            messageCallback(error.error);
        })

    }

    return (
        <form onSubmit={onCreateCharacter}>
            <p className="headline">{t("character_creator.new_character")}</p>
            <Row className="py-3 g-4">
                <MudInput required colmd={6} name="name" value={name} onChange={event=>setName(validator.cirName(event.target))} type="text" placeholder="Charaktername wählen" />
                <MudSelect required colmd={6} name="class" label={t("dungeon_keys.class")}>
                    {classes.map((cl, index) => {
                        return (
                            <option key={index} value={cl.id}>{cl.name}</option>
                        )
                    })}
                </MudSelect>
                <MudSelect required colmd={6} name="gender" label={t("dungeon_keys.gender")}>
                    {genders.map((ge, index) => {
                        return (
                            <option key={index} value={ge.id}>{ge.name}</option>
                        )
                    })}
                </MudSelect>
                <MudSelect required colmd={6} name="species" label={t("dungeon_keys.species")}>
                    {species.map((sp, index) => {
                        return (
                            <option key={index} value={sp.id}>{sp.name}</option>
                        )
                    })}
                </MudSelect>
            </Row>

            <Row className="text-end">
                <Col>
                    <button className="btn drawn-border btn-green btn-xpadding" type="submit">{t("character_creator.create")}</button>
                </Col>
            </Row>

        </form>

    )
}

export default CreateNewCharacter;