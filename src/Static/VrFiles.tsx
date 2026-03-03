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
        name: '.Usdz',
        aRUrl: 'https://rengyapi.coderz-demo.com/uploads/arvr-assets/toy_drummer.usdz',
    },
    {
        name: '.Reality',
        aRUrl: 'https://rengyapi.coderz-demo.com/uploads/arvr-assets/hab_en.reality',
    },
];

export default Platform.OS === 'android' ? dataAndroid : dataIOS;
