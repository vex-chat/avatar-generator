import Color from "color";
import colorList from "./colors.json";
import { avatar } from "./vex-avatar.svg.js";

const BG_COLOR = "#ffffff";
const FG_COLOR = "#000000";

interface IContrastDetails {
    name: string;
    contrast: number;
}

interface IColorDetails {
    name: string;
    variable: string;
    hex: string;
    rgb: string;
    hsl: string;
    pms: string | null;
    contrastList: IContrastDetails[];
}

export function vexAvatar(fg: string, bg: string): string {
    return avatar.replace(FG_COLOR, fg).replace(BG_COLOR, bg);
}

export function vexAvatarFromUUID(uuid: string) {
    const bgStr = `#${uuid.slice(0, 6)}`;
    const bgColor: IColorDetails = getClosestColor(bgStr, colorList);

    const fgStr = `#${uuid.slice(30, 36)}`;
    const fgColor = getClosestColor(
        fgStr,
        bgColor.contrastList.map((contrastDetails) =>
            getColorByName(contrastDetails.name)
        )
    );

    return vexAvatar(fgColor.hex, bgColor.hex);
}

const distance = (color1: number[], color2: number[]) => {
    let acc = 0;
    for (let i = 0; i < color1.length; i++) {
        acc += (color1[i] - color2[i]) * (color1[i] - color2[i]);
    }
    return Math.sqrt(acc);
};

const getColorByName = (name: string): IColorDetails => {
    for (const color of colorList) {
        if (color.name === name) {
            return color;
        }
    }
    throw new Error("No color found!");
};

const getClosestColor = (colorStr: string, cList: IColorDetails[]) => {
    let matchColor = cList[1];
    let smallestDistance = 99999999;
    for (const color of cList) {
        const generatedColor = new Color(colorStr);
        const setColor = new Color(color.hex);
        const dist = distance(
            generatedColor.rgb().array(),
            setColor.rgb().array()
        );
        if (dist < smallestDistance) {
            smallestDistance = dist;
            matchColor = color;
        }
    }
    return matchColor;
};
