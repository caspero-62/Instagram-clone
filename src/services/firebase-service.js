import {firebase, FieldValue} from '../lib/firebase';

export const doesUserNameExist = async (username) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('username', '==', username)
        .get();

    return result.docs.map(user => user.data().length > 0);
}

export const getUserById = async (userId) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', userId)
        .get();

    const user = result.docs.map(item => ({
        ...item.data(),
        docId: item.id
    }));

    return user;
}

export const getSugestedProfiles = async (id, following) => {
    const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', 'not-in', [...following, id])
        .limit(5)
        .get();

    const profiles = result.docs.map(item => ({
        ...item.data(),
        docId: item.id
    }));

    return profiles;
}

export const updateFollowersById = async (userDocId, followerId, isFollowedByProfile) => {
    return firebase
        .firestore()
        .collection('users')
        .doc(userDocId)
        .update({
            followers: isFollowedByProfile 
                ? FieldValue.arrayRemove(followerId) 
                : FieldValue.arrayUnion(followerId)
        })
}


export const updateFollowingById = async (userDocId, followedId, isFollowingProfile) => {
    return firebase
        .firestore()
        .collection('users')
        .doc(userDocId)
        .update({
            following: isFollowingProfile 
                ? FieldValue.arrayRemove(followedId) 
                : FieldValue.arrayUnion(followedId)
        })
}

export const getPhotosById = async (userId, following) => {
    const result = await firebase
        .firestore()
        .collection('photos')
        .where('userId', 'in', following)
        .get();

        
    const photos = result.docs.map(photo => ({
        ...photo.data(),
        docId: photo.id 
    }));
        
    const photosWithUserDetails = await Promise.all(
        photos.map(async photo => {
            let userLikedPhoto = false;
            if (photo.likes.includes(userId)){
                userLikedPhoto = true;
            }
        
            const photoAuthor = await getUserById(photo.userId);
            const { username: photoAuthorUserName = '', emailAddress, fullName } = photoAuthor[0];

            return { photoAuthorUserName, emailAddress, fullName, ...photo, userLikedPhoto };
        })
    )

    return photosWithUserDetails;
}