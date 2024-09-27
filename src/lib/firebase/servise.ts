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

  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
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
