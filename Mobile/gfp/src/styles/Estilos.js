export const corPrincipal = "#41d3be";
export const corSecundaria = "#64748b";
export const corTextos = "#f8fafc";
export const corFundo = "#000000";
export const corFundoSecundario = "#1e293b";

const Estilos = {
    conteudo: {
        flex : 1,
        width: "100%",
        backgroundColor: corFundo,
    },
    conteudoHeader: {
        flex : 1,
        backgroundColor: "#008080",
        border: 'none'
    },
    conteudoCorpo: {
        flex : 1,
        backgroundColor: "#f8f8f8",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        padding: 10,
    },
    modalFundo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalConteudo: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 24,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#41d3be',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    modalTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#41d3be',
        marginBottom: 18,
        letterSpacing: 1,
        textAlign: 'center',
    },
    inputModal: {
        flex: 1,
        fontSize: 16,
        color: '#222',
        backgroundColor: '#f1f6fa',
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    corBotao: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#41d3be',
        marginHorizontal: 4,
    },
    iconeBotao: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#41d3be',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 24,
        gap: 12,
    },
    TextbotaoCancelar: {
        color: '#e63946',
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        backgroundColor: '#f8d7da',
        overflow: 'hidden',
    },
    TextbotaoSalvar: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        backgroundColor: '#41d3be',
        overflow: 'hidden',
    },
    seletorContainer: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 20,
        width: '90%',
        alignItems: 'center',
        shadowColor: '#41d3be',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 8,
    },
    fecharModal: {
        alignSelf: 'flex-end',
        marginBottom: 10,
    },
    listaModal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 10,
    },
    erroMsg: {
        color: '#e63946',
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 8,
        alignSelf: 'flex-start',
    },


}
export default Estilos;