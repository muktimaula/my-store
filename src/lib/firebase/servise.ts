import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import App from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(App);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retrieveDataById(collectionName: string, id: string) {
  const snapshot = await getDoc(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

// membuat function login

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  callBack: Function
) {
  // berguna untuk registrasi yang error
  if (!userData.email) {
    console.error("Email is missing");
    callBack(false);
    return;
  }
  //untuk mengecek apakah email sudah terdaftar
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email) //user yang sudah terdaftar tidak boleh registrasi
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callBack(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    }
    // hashing password dengan bcrypt
    userData.password = await bcrypt.hash(userData.password, 10);
    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callBack(true);
      })
      .catch((error) => {
        callBack(false);
        console.log("Error signing up:", error);
      });
  }
}
//lanjut membuat api di firebase

//2.membuat fungtion login dengan librya next auth versi 4.24.8
export async function signIn(email: string) {
  //untuk mengecek apakah email sudah terdaftar
  const q = query(
    collection(firestore, "users"),
    where("email", "==", email) //user yang sudah terdaftar tidak boleh registrasi
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data) {
    return data[0];
  } else {
    return null;
  }
  //lanjut membuat api (firebase) [...nextauth].ts di api/auth
}
