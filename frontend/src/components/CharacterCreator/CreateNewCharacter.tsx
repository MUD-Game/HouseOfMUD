
/**
 * @module CreateNewCharacter
 * @category React Components
 * @description Component to create a new character
 * @props {@linkcode CreateNewCharacterProps}
 */

import React, { FormEvent } from 'react';
import { supervisor } from 'src/services/supervisor';
import { CreateCharacterRequest, GetCharacterAttributesResponse } from '@supervisor/api';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from 'src/hooks/useGame';
import { Col, Row } from 'react-bootstrap';
import MudInput from '../Custom/MudInupt';
import MudSelect from '../Custom/MudSelect';
import { useTranslation } from 'react-i18next';

export interface CreateNewCharacterProps extends GetCharacterAttributesResponse {
    onCreate: () => void
}

interface PropValues { id: string; name: string; description: string }
const CreateNewCharacter: React.FC<CreateNewCharacterProps> = ({ classes, genders, species, onCreate }) => {

    const auth = useAuth();
    const game = useGame();
    const {t} = useTranslation();

    const onCreateCharacter = (evt: FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        let formData = new FormData(evt.currentTarget);
        let bodyData: CreateCharacterRequest = {
            characterData: {
                name: formData.get("name") as string,
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
            alert(error);
        })

    }

    return (
        <form onSubmit={onCreateCharacter}>
            <p className="headline">{t("character_creator.new_character")}</p>
            <Row className="py-3 g-4">
                <MudInput required colmd={6} name="name" type="text" placeholder="Charaktername wählen" />
                {/* <div className="col-md-6">
                    <label htmlFor="fullname"><b>Fullname:</b></label>
                    <input required className="drawn-border input-standard" type="text" name="fullname" placeholder="Fullname wählen" />
                </div> */}
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