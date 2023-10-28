/* eslint-disable new-cap */
import { FontStyle, Skia } from '@shopify/react-native-skia';
import { Platform } from 'react-native';

const familyName = Platform.select({ default: 'serif', ios: 'Helvetica' });
const fontSize = 32;
// Get the system font manager
const fontMgr = Skia.FontMgr.System();
const typeface = fontMgr.matchFamilyStyle(familyName, FontStyle.Bold);

export const DEFAULT_FONT = Skia.Font(typeface, fontSize);
