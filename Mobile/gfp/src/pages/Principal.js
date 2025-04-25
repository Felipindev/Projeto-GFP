import { Text, StyleSheet, View } from 'react-native';

export default function Principal ({navigation}){
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo ao GFP!</Text>
            <Text style={styles.subtitle}>Gerenciador de Finanças Pessoais</Text>
            <Text style={styles.subtitle}>Tela Principal</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
    },
})