
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
import { Col, Row } from 'react-bootstrap';

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
            <p className="headline">Neuen Charakter anlegen</p>
            <Row className="py-3 g-4">
                <div className="col-md-6">
                    <label htmlFor="name"><b>Charaktername:</b></label>
                    <input required className="drawn-border input-standard" type="text" name="name" placeholder="Charaktername wählen" />
                </div>
                {/* <div className="col-md-6">
                    <label htmlFor="fullname"><b>Fullname:</b></label>
                    <input required className="drawn-border input-standard" type="text" name="fullname" placeholder="Fullname wählen" />
                </div> */}
                <div className="col-md-6">
                    <label htmlFor="class"><b>Klasse:</b></label>
                    <select className="drawn-border select-standard" name="class">
                        {classes.map((cl, index) => {
                            return (
                                <option key={index} value={cl.id}>{cl.name}</option>
                            )
                        })}
                    </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="gender"><b>Geschlecht:</b></label>
                    <select className="drawn-border select-standard" name="gender">
                    {genders.map((cl, index) => {
                        return (
                            <option key={index} value={cl.id}>{cl.name}</option>
                        )
                    })}
                </select>
                </div>
                <div className="col-md-6">
                    <label htmlFor="species"><b>Spezies:</b></label>
                    <select className="drawn-border select-standard" name="species">
                        {species.map((cl, index) => {
                            return (
                                <option key={index} value={cl.id}>{cl.name}</option>
                            )
                        })}
                    </select>
                </div>
            </Row>

            <Row className="text-end">
                <Col>
                    <button className="btn drawn-border btn-green btn-xpadding" type="submit">Erstellen und Beitreten</button>
                </Col>
            </Row>
            
        </form>
        
    )
}

export default CreateNewCharacter;