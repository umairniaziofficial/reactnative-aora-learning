import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";


export const appWrite = {
  projectID: "670bcf8c0030ed2b4476",
  databaseId: "670bda90003d8354cece",
  videoCollectionId: "670bdafd001b4b027a09",
  userCollectionId: "670bdac7002171fd0ca6",
  endPoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  storageID: "670bdc2b003bf97f5781"
};


let client = new Client();
client
  .setEndpoint(appWrite.endPoint) 
  .setProject(appWrite.projectID)   
  .setPlatform(appWrite.platform);   


let avatars = new Avatars(client);
let account = new Account(client);
let databases = new Databases(client);
let storage = new Storage(client);

/**
 * Creates a new user with the provided email, password, and username.
 */
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
      appWrite.databaseId,
      appWrite.userCollectionId,
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

/**
 * Logs in a user with the provided email and password.
 */
export const loginUser = async (email, password) => {
  try {
    // Check for an active session
    const currentSession = await account.getSession("current");
    
    if (currentSession) {
      console.log("Current session exists. Logging out...");
      // Log out the current session
      await account.deleteSession("current");
      console.log("Logged out successfully.");
    }

    // Proceed with creating a new session
    const response = await account.createEmailPasswordSession(email, password);
    console.log("Login successful:", response);
    return response; // Return the response of login
  } catch (error) {
    console.error("Login error:", error);
    throw error; // Propagate the error
  }
};

/**
 * Retrieves the current logged-in user's details.
 */
export const getUser = async () => {
  try {
    const session = await account.getSession("current");
    if (!session) {
      throw new Error("No active session. Please log in.");
    }

    const user = await account.get();
    if (!user) throw new Error("No user session found");

    const currentUser = await databases.listDocuments(
      appWrite.databaseId,
      appWrite.userCollectionId,
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

/**
 * Logs out the current user.
 */
export const signOut = async () => {
  try {
    await account.deleteSession("current"); 
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
    throw error; 
  }
};

/**
 * Fetches all posts from the video collection in the database.
 */
export const getAllposts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseId,
      appWrite.videoCollectionId
    );
    return posts.documents; 
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

/**
 * Fetches the latest 7 posts from the video collection.
 */
export const getLatestposts = async () => {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseId,
      appWrite.videoCollectionId,
      [Query.orderDesc('$createdAt', Query.limit(7))]
    );
    return posts.documents; 
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

/**
 * Searches for posts by title based on the provided query.
 */
export const getSearchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments( 
      appWrite.databaseId,
      appWrite.videoCollectionId,
      [Query.search("title", query)]
    );  

    if (!posts) throw new Error("Something went wrong");
    return posts.documents; 
  } catch (error) {
    throw new Error(error); 
  }
};

/**
 * Fetches posts created by a specific user identified by userId.
 */
export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(
      appWrite.databaseId,
      appWrite.videoCollectionId,
      [Query.equal("users", userId)]
    );
    return posts.documents; 
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error; 
  }
}

/**
 * Retrieves a preview URL for a file based on its type (video or image).
 */
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(appWrite.storageID, fileId); 
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        appWrite.storageID,
        fileId,
        2000, 
        2000, 
        "top", 
        100   
      ); 
    } else {
      throw new Error("Invalid file type"); 
    }

    if (!fileUrl) throw Error; 

    return fileUrl; 
  } catch (error) {
    throw new Error(error); 
  }
}

/**
 * Uploads a file to storage and returns its preview URL.
 */
export async function uploadFile(file, type) {
  if (!file) return; 

  const { mimeType, ...rest } = file; 
  const asset = { type: mimeType, ...rest }; 

  try {
    const uploadedFile = await storage.createFile(
      appWrite.storageID,
      ID.unique(),
      asset 
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type); 
    return fileUrl; 
  } catch (error) {
    throw new Error(error); 
  }
}

/**
 * Creates a new video post with the provided form data.
 */
export async function createVideoPost(form) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"), 
      uploadFile(form.video, "video"),     
    ]);

    
    const newPost = await databases.createDocument(
      appWrite.databaseId,
      appWrite.videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost; 
  } catch (error) {
    throw new Error(error); 
  }
}
