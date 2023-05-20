import { SvgIcon } from "@mui/material";
import { ReactComponent as F1Car } from "assets/img/icons/f1-car.svg";

export default function F1CarIcon(props){
    return(
        <SvgIcon {...props}>
            <F1Car/>
        </SvgIcon>
    )
}