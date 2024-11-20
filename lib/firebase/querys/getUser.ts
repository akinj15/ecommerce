/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endereco } from "@/types/endereco";
import { Estabelecimento } from "@/types/estabelecimentos";
import { ItemCarrinho } from "@/types/usuario";
import { collection, doc, Firestore, getDoc, getDocs } from "firebase/firestore";


export async function getClientes(
  db: Firestore,
  filters: { id: string },
) {
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  let retorno;
  if (docSnap.exists()) {
    const dt = docSnap.data();
    retorno = {
      id: docSnap.id,
      nome: dt.nome,
      cpf: dt.cpf,
      telefone: dt.telefone,
      carrinho: dt.carrinho,
    };
  }
  return retorno;
}

export async function getClienteById(
  db: Firestore,
  filters: { id: string },
  cb: (e: any) => void,
) {
  const docRef = doc(db, "cliente", filters.id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const dt = docSnap.data();
    cb(dt);
  }
}

export async function getCarrinhoByClienteId(
  db: Firestore,
  filters: { id: string }
) {
  const querySnapshot = await getDocs(
    collection(db, "cliente", filters.id, "carrinho")
  );
  const res: ItemCarrinho[] = [];
  querySnapshot.forEach((doc) => {
    const dt = doc.data();
    res.push({
      id: doc.id,
      chave: dt.chave,
      nome: dt.nome,
      imgUrl: dt.imgUrl,
      quantidade: dt.quantidade,
      preco: dt.preco,
    });
  });
  return res;
}

export async function getEnderecoByClienteId(
  db: Firestore,
  filters: { id: string }
) {
  const querySnapshot = await getDocs(
    collection(db, "cliente", filters.id, "endereco")
  );
  const res: Endereco[] = [];
  querySnapshot.forEach((doc) => {
    const dt = doc.data();
    res.push({
      id: doc.id,
      rua: dt.rua,
      numero: dt.numero,
      bairro: dt.bairro,
      uf: dt.uf,
      cep: dt.cep,
      cidade: dt.cidade,
      complemento: dt.complemento,
      estado: dt.estado,
    });
  });
  return res;
}

export async function getEstabelecimentos(
  db: Firestore,
) {
  const querySnapshot = await getDocs(
    collection(db, "estabelecimentos")
  );
  const res: Estabelecimento[] = [];
  querySnapshot.forEach((doc) => {
    const dt = doc.data();
    console.log(dt)
    res.push({
      id: doc.id,
      uf: dt.uf,
      empresa: dt.empresa,
      codigo: dt.codigo,
      cidade: dt.cidade,
      bairro: dt.bairro,
      chave: dt.chave,
      email: dt.email,
      fone: dt.fone,
      endereco: dt.endereco,
      cnpj: dt.cnpj,
      locescritu: dt.locescritu ? {
        chave: dt.locescritu.chave,
        nome: dt.locescritu.nome,
        codigo: dt.locescritu.codigo,
      } : null,
      imagem: dt.imagem,

    });
  });
  return res;
}
