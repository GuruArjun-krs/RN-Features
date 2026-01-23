import { Platform } from 'react-native';
import { ItemType } from '../Utils/types';

const dataAndroid: ItemType[] = [
    {
        name: 'Android Url',
        aRUrl: 'http://193.203.163.20:8009/uploads/arvr-assets/SHED/3KW.glb',
    },
];

const dataIOS: ItemType[] = [
    {
        name: 'IOS Url',
        aRUrl: 'https://developer.apple.com/augmented-reality/quick-look/models/biplane/toy_biplane_idle.usdz',
    },
];
export default Platform.OS === 'android' ? dataAndroid : dataIOS;
