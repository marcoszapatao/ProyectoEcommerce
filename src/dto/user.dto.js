

export const userToDto = (user) => {
    return {
        id: user._id,
        firstName: user.first_name,
        lastName: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role
    };
};
