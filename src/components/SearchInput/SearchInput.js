// reactstrap components
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Input,
} from "reactstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchInput = (props) => {
    const { handleSearch, placeHolder } = props;
    return (
        <InputGroup className="input-group-alternative mb-3">
            <InputGroupAddon addonType="prepend">
                <InputGroupText>
                    <FontAwesomeIcon className="text-dark" icon={faSearch} />
                </InputGroupText>
            </InputGroupAddon>
            <Input placeholder={placeHolder} type="text" className="text-dark" onChange={handleSearch} />
        </InputGroup>
    );
};

export default SearchInput;

