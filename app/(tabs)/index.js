import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appWrite = {
  projectID: "670bcf8c0030ed2b4476",
  databaseID: "670bda90003d8354cece",
  videoCollectionID: "670bdafd001b4b027a09",
  userCollectionID: "670bdac7002171fd0ca6",
  endPoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
};

let client = new Client();

client
  .setEndpoint(appWrite.endPoint)
  .setProject(appWrite.projectID)
  .setPlatform(appWrite.platform);

let avatars = new Avatars(client);
let account = new Account(client);
let databases = new Databases(client);

export const createUser = async (email, password, username) => {
  try {
    const response = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!response) {
      throw new Error("User creation failed");
    }

    const avatarURL = avatars.getInitials(username);

    await loginUser(email, password);

    await databases.createDocument(
      appWrite.databaseID,
      appWrite.userCollectionID,
      ID.unique(),
      {
        accountId: response.$id,
        email: email,
        username: username,
        avatar: avatarURL,
      }
    );

    return response;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await account.createEmailPasswordSession(email, password);
    console.log("Login successful:", response);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const session = await account.getSession("current");
    if (!session) {
      throw new Error("No active session. Please log in.");
    }

    const user = await account.get();
    if (!user) throw new Error("No user session found");

    const currentUser = await databases.listDocuments(
      appWrite.databaseID,
      appWrite.userCollectionID,
      [Query.equal("accountId", user.$id)]
    );

    if (!currentUser || currentUser.documents.length === 0) {
      throw new Error("No user data found in database");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};


export const getAllposts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseID,
      appWrite.videoCollectionID
    );
    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export const getLatestposts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseID,
      appWrite.videoCollectionID,
      [Query.orderDesc('$createdAt',Query.limit(7))]
    );
    return posts.documents;
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export const getSearchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments( 
      appWrite.databaseID,
      appWrite.videoCollectionID,
      [Query.search("title", query)]
    );  

    if (!posts) throw new Error("Something went wrong");
    return posts.documents;
  } catch (error) {
    throw new Error(error);
  }
};


export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseID,
      appWrite.videoCollectionID,
      [Query.equal("users", userId)]
    );
    return posts.documents;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}