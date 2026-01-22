import React, { JSX } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { ItemType } from '../../Utils/types';

type ARItemProps = {
    item: ItemType;
    onPress: () => void;
};

function ARItem(props: ARItemProps): JSX.Element {
    const { item, onPress } = props;
    const { name } = item;
    return (
        <TouchableOpacity style={{ padding: 10, alignItems: 'center', borderWidth: 1, marginHorizontal: 12, borderRadius: 12 }} onPress={onPress}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
});

export default ARItem;
