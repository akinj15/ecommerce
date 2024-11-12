
export const constantes = {
    apiUrl: process.env.API_URL || '',
    rotaPedidos: process.env.ROTA_PEDIDOS || '',
    rotaClientes: process.env.ROTA_CLIENTES || '',
    rotaVendedores: process.env.ROTA_VENDEDORES || '',
    rotaRecursos: process.env.ROTA_RECURSOS || '',
    rotaPreco: process.env.ROTA_PRECO || '',
    rotaRecursoSaldo: process.env.ROTA_RECURSO_SALDO || '',
    rotaCadastrarClientes: process.env.ROTA_CADASTRAR_CLIENTES || '',
    rotaPagamentos: process.env.ROTA_PAGAMENTOS || '',
    rotaEstabelecimentos: process.env.ROTA_ESTABELECIMENTOS || '',
    rotaFrete: process.env.ROTA_FRETE || '',
    rotaTipoLogradouro: process.env.ROTA_TIPOLOGRADOURO|| '',
    rotaTipoComportamentoFiscal: process.env.ROTA_TIPOCOMPORTAMENTOFISCAL|| '',
    token: process.env.TOKEN || ''
};

// MELHORIA PARA FAZER DEPLOY COM O SECURT

/*

    const consts = await constantes2();
    const secrets = await loadSecrets();

    const apiUrl = secrets.API_URL;
    const token = secrets.TOKEN;

*/
// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// const client = new SecretManagerServiceClient();

// export async function loadSecrets(): Promise<{ API_URL: string, TOKEN: string }> {
//     const [apiUrlVersion] = await client.accessSecretVersion({
//         name: `projects/${process.env.GCLOUD_PROJECT}/secrets/API_URL/versions/latest`,
//     });

//     const [tokenVersion] = await client.accessSecretVersion({
//         name: `projects/${process.env.GCLOUD_PROJECT}/secrets/TOKEN/versions/latest`,
//     });

//     if (!apiUrlVersion.payload || !apiUrlVersion.payload.data || !tokenVersion.payload || !tokenVersion.payload.data) {
//         throw new Error(`Failed to load secrets.`);
//     }

//     const API_URL = apiUrlVersion.payload.data.toString();
//     const TOKEN = tokenVersion.payload.data.toString();

//     return { API_URL, TOKEN };
// }


// export const constantes2 = async () => {
//     const secrets = await loadSecrets();
//     return {
//         rotaPedidos: process.env.ROTA_PEDIDOS || '',
//         rotaClientes: process.env.ROTA_CLIENTES || '',
//         rotaVendedores: process.env.ROTA_VENDEDORES,
//         rotaRecursos: process.env.ROTA_RECURSOS || '',
//         rotaRecursoSaldo: process.env.ROTA_RECURSO_SALDO || '',
//         rotaCadastrarClientes: process.env.ROTA_CADASTRAR_CLIENTES || '',
//         rotaPagamentos: process.env.ROTA_PAGAMENTOS || '',
//         rotaEstabelecimentos: process.env.ROTA_ESTABELECIMENTOS || '',
//         apiUrl: secrets.API_URL,
//         token: secrets.TOKEN
//     };
// };
