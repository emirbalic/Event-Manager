import { toastr } from "react-redux-toastr";

export const updateProfile = (user) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  // <<< spread operator is excluding fields that are not necessary and updatedUser is fields from redux form minus these two >>> //
  const {isLoaded, isEmpty, ...updatedUser} = user;
  toastr.success('Success', 'Your profile has been updated');
  try {
    await firebase.updateProfile(updatedUser);
  } catch (error) {
    console.log(error);
  }
};
