import { SvgIcon } from "@mui/material";
import { ReactComponent as F1Driver } from "assets/img/icons/f1-driver.svg";

export default function F1DriverIcon(props){
    return(
        <SvgIcon {...props}>
            <F1Driver/>
        </SvgIcon>
    )
}