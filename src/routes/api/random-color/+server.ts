import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import colors from '../../colors/colors.json';

export const GET: RequestHandler = async () => {
    const colorNames = Object.keys(colors);
    const randomIndex = Math.floor(Math.random() * colorNames.length);
    const randomColorName = colorNames[randomIndex];
    const randomColorHex = colors[randomColorName];
    
    return json({
        name: randomColorName,
        hex: randomColorHex
    });
};
