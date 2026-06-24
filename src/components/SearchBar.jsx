import React,{ useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { COLORS } from '../constants/colors';

const SearchBar = ({
    value,
    onChangeText,
    placeholder = 'Search...',
}) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: isFocused
                        ? COLORS.primary
                        : COLORS.border,
                },
            ]}>
            <Ionicons
                name="search-outline"
                size={20}
                color={COLORS.primary}
            />

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={COLORS.textSecondary}
                value={value}
                onChangeText={onChangeText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 45,
        marginVertical: 10,
        borderWidth: 1,
    },

    input: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
});

export default SearchBar;