const Axios = require("axios");
const WebSocket = require("ws");

const BACKEND_URL = "http://localhost:3000";
const WS_URL = "ws://localhost:3001";

const axios = {
    post: async (...args) => {
        try {
            const res = await Axios.post(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },

    get: async (...args) => {
        try {
            const res = await Axios.get(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },

    put: async (...args) => {
        try {
            const res = await Axios.put(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    },

    delete: async (...args) => {
        try {
            const res = await Axios.delete(...args);
            return res;
        } catch (e) {
            return e.response;
        }
    }
}

describe("Authentication endpoint", () => {
    test("User should be able to sign up with a unique username", async () => {
        const username = `sk-auth1-${Math.floor(Math.random() * 10)}`;
        const password = `1234`;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(resposne.status).toBe(200);

        //if someone tries to sign-up using the same username

        const updatedResposne = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(updatedResposne.status).toBe(409);
    });

    test("User should be able to sign in with correct credentials", async () => {
        const username = `sk-auth2-${Math.floor(Math.random() * 10)}`;
        const password = `1234`;

        const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        //console.log(res);

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(resposne.status).toBe(200);
        expect(resposne.data.data.token).toBeDefined();
    });

    test("User tries sign-in with invalid credentials", async () => {

        let username = `sk-auth3-${Math.floor(Math.random() * 10)}`;
        let password = `1234`;

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "user"
        });

        //invalid password

        let password2 = `invalid_passowrd`;

        const updatedRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password: password2
        });

        expect(updatedRes.status).toBe(400);


        // invalid username

        let username2 = `142267`;

        const updatedRes2 = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: username2,
            password
        });

        expect(updatedRes2.status).toBe(404);
    });

    test("User tries sign-up with empty feild(s)", async () => {
        const username = "";
        const password = `1234`;

        const res = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        });

        expect(res.status).toBe(400);

        const username1 = `sk-auth4-${Math.floor(Math.random() * 10)}`;
        const password1 = "";

        const res1 = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: username1,
            password: password1
        });

        expect(res1.status).toBe(400);
    });

    afterAll(async() => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("User metadata endpoint", () => {
    jest.setTimeout(15000);

    let token, avatarId;
    beforeAll(async () => {
        const username = `sk-${Math.floor(Math.random() * 10)}`;
        const password = "1234";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        token = resposne.data.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        avatarId = avatarResponse.data.data.avatarId;
    });

    test("User can't update their metadata", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId: 17125127
        },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        expect(response.status).toBe(400)
    });

    test("User can update their metadata", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        },
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        expect(response.status).toBe(200);
    });

    test("User can't update their metadata beacuse of not authorization header", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        });

        expect(response.status).toBe(401);
    });

    afterAll(async() => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("User avatar information endpoint", () => {
    let token, avatarId, userId;
    beforeAll(async () => {
        const username = `sk-${Math.floor(Math.random() * 10)}`;
        const password = "1234";

        const responseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        userId = responseSignup.data.data.userId;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        token = resposne.data.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        avatarId = avatarResponse.avatarId;
    });

    test("Get avatar information for the user", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

        expect(response.data.data.users.length).toBe(1);
    });

    test("Get all avatars avaibale", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

        expect(response.data.data.avatar).not.toBe(0);

        const currAvatar = response.data.data.avatar.filter(x => x.id);


        expect(currAvatar.length).toBeDefined();
    });

    afterAll(async () => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("Space information", () => {
    let userToken, adminToken, avatarId, userId, adminId, mapId, elementId;

    beforeAll(async () => {

        //ADMIN
        const username = `admin-${Math.floor(Math.random() * 10)}`;
        const password = "1234";

        const responseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = responseSignup.userId;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        adminToken = resposne.data.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        avatarId = avatarResponse.data.data.avatarId;

        const element1 = {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not
        }

        const responseElement1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, element1, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        const responseElement2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, element1, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        elementId = [responseElement1.data.data.id, responseElement2.data.data.id];

        const responseForMap = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: responseElement1.data.data.id,
                x: 20,
                y: 20
            },
            {
                elementId: responseElement2.data.data.id,
                x: 40,
                y: 50
            }]
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        mapId = responseForMap.data.data.id;

        //USER

        const userUsername = `user-${Math.floor(Math.random() * 10)}`;
        const userPasswod = '12345';

        const userResponseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: userUsername,
            password: userPasswod,
            type: "user"
        });

        userId = userResponseSignup.data.data.userId;

        const userResponseSigin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: userUsername,
            password: userPasswod
        });

        userToken = userResponseSigin.data.data.token;
    });


    test("User is able to create a space", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "200x400",
            mapId
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(response.data.data.spaceId).toBeDefined();
    });

    test("User is able to create a space without mapId", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "200x400"
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(response.data.data.spaceId).toBeDefined();
    });

    test("User is unable to create a space without dimensions and mapId", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test"
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(response.status).toBe(400);
    });

    test("User is unable to delete a map that doesn't exist", async () => {

        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomInvalidMapId`,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(response.status).toBe(400);
    });

    test("User is able to delete a space using spaceId", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "200x400"
        });

        const deleteResponse = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        })
    });

    test("User can't delete another user's space", async () => {
        const user2Username = `newSk-${Math.floor(Math.random() * 10)}`;
        const user2Password = "12345";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: user2Username,
            password: user2Password,
            type: "user"
        });

        const signInRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: user2Username,
            password: user2Password
        });

        //create a space using USER2
        const newSpaceCreatedByUser2 = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "test2",
            dimensions: "200x400"
        },
            {
                headers: {
                    Authorization: `Bearer ${signInRes.data.token}`
                }
            });

        const user1TriesToDeleteSpaceMadeByUser2 = await axios.delete(`${BACKEND_URL}/api/v1/space/${newSpaceCreatedByUser2.data.spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(user1TriesToDeleteSpaceMadeByUser2.status).toBe(400);
    });

    test("Admin has no space initially", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        expect(response.data.data.spaces.length).toBe(0);
    });

    test("Admin has exactly one space after creation of one space only", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "200x400"
        },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

        const getAllExistingSpaces = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        expect(getAllExistingSpaces.data.data.spaces.length).toBe(1);

        const foundSpace = getAllExistingSpaces.data.data.spaces.find(x => x.id === response.data.data.spaceId);
        expect(foundSpace).toBeDefined();
    });

    afterAll(async () => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("Arena informatin", () => {
    let userToken, adminToken, avatarId, userId, adminId, mapId, elementId, spaceId;

    beforeAll(async () => {

        //ADMIN
        const username = `admin-${Math.floor(Math.random() * 100)}`;
        const password = "1234";

        const responseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        adminId = responseSignup.data.data.userId;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        adminToken = resposne.data.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        }, {
            headers: {
                authorization: `Bearer ${adminToken}`
            }
        });

        avatarId = avatarResponse.data.data.avatarId;

        const element1 = {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not
        }

        const responseElement1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, element1, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        const responseElement2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, element1, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        elementId = [responseElement1.data.data.id, responseElement2.data.data.id];

        const responseForMap = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: elementId[0],
                x: 20,
                y: 20
            },
            {
                elementId: elementId[1],
                x: 40,
                y: 50
            }]
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        mapId = responseForMap.data.data.id;


        //USER

        const userUsername = `user-${Math.floor(Math.random() * 10)}`;
        const userPasswod = '12345';

        const userResponseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: userUsername,
            password: userPasswod,
            type: "user"
        });

        userId = userResponseSignup.data.data.userId;

        const userResponseSigin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: userUsername,
            password: userPasswod
        });

        userToken = userResponseSigin.data.data.token;

        //SPACE

        const spaceRes = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            name: "Test",
            dimensions: "200x400",
            mapId
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        spaceId = spaceRes.data.data.spaceId;
    });

    test("Incorrect space id couldn't fetch the map", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/RandomeInvalidSpaceId`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(response.status).toBe(400);
    });

    test("Correct spaceId fetches the correct map with elements", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(response.data.data.space).toBeDefined();
        expect(response.data.data.space[0].elements.spaceElements.length).toBe(2);
        expect(response.data.data.space[0].dimension).toBe("200x400");
    });

    // test("Delete an element from user space", async () => {
    //     const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
    //         headers: {
    //             Authorization: `Bearer ${userToken}`
    //         }
    //     });


    //     const detelted = await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
    //         data: {
    //             spaceId: spaceId,
    //             elementId: elementId[0]
    //         }
    //     },
    //         {
    //             headers: {
    //                 authorization: `Bearer ${userToken}`
    //             }
    //         });

    //     console.log(userToken);

    //     const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
    //         headers: {
    //             Authorization: `Bearer ${userToken}`
    //         }
    //     });

    //     console.log(newResponse.data.data.space[0]);

    //     expect(newResponse.data.data).toBeDefined();
    //     expect(newResponse.data.data.space[0].elements.spaceElements.length).toBe(1);
    // });

    test("Add an element into the user space", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });


        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": elementId[1],
            "spaceId": spaceId,
            "x": 50,
            "y": 20
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.data.data).toBeDefined();
        expect(newResponse.data.data.space[0].elements.spaceElements.length).toBe(response.data.data.space[0].elements.spaceElements.length + 1);
    });

    test("Add an element into the user space ouside the specified dimensions", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        const val = await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": elementId[1],
            "spaceId": spaceId,
            "x": 1000000000000,
            "y": 9999999999999
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(val.status).toBe(400);
        expect(newResponse.data.data.space[0].elements.spaceElements.length).toBe(response.data.data.space[0].elements.spaceElements.length);
    });

    afterAll(async () => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("Admin Endpoints", () => {
    let adminId;
    let adminToken;
    let userId;
    let userToken;
    let elementId;

    beforeAll(async () => {
        const adminUsername = `admin-${Math.floor(Math.random() * 10)}`;
        const adminPassword = "12345";

        const signupResAdmin = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: adminUsername,
            password: adminPassword,
            type: "admin"
        });

        adminId = signupResAdmin.data.data.userId;

        const signinResAdmin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: adminUsername,
            password: adminPassword
        });

        adminToken = signinResAdmin.data.data.token;

        //USER
        const userUsername = `sk-${Math.floor(Math.random() * 10)}`;
        const userPassword = "12345";

        const signupResUser = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: userUsername,
            password: userPassword,
            type: "user"
        });

        userId = signupResUser.data.data.userId;

        const signinResUser = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: userUsername,
            password: userPassword
        });

        userToken = signinResUser.data.data.token;

        //CREATE AN ELEMENT BEFOREHAND FOR TESTING ENDPOINT OF UPDATING AN ELEMENT
        const elementResposne = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 10,
            "height": 10,
            "static": true
        },
            {
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            });

        elementId = elementResposne.data.data.id;

    });

    test("User is not able to hit admin endpoints", async () => {

        const elementResposne = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        },
            {
                headers: {
                    "Authorization": `Bearer ${userToken}`
                }
            });

        expect(elementResposne.status).toBe(403);

        //FOR MAP
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": []
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(mapResponse.status).toBe(403);


        //FOR AVATAR
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(avatarResponse.status).toBe(403);


        //EDIT ELEMENT
        const upadateElementResponse = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementId}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"
        }, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        
        expect(upadateElementResponse.status).toBe(403);

    });

    test("Admin is able to hit admin endpoints", async () => {

        //ELEMENT
        const elementResposne = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        },
            {
                headers: {
                    "Authorization": `Bearer ${adminToken}`
                }
            });

        expect(elementResposne.status).toBe(200);
        expect(elementResposne.data.data.id).toBeDefined();

        //FOR MAP
        const mapResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": []
        },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

        expect(mapResponse.status).toBe(200);
        expect(mapResponse.data.data.id).toBeDefined();


        //FOR AVATAR
        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        },
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`
                }
            });

            

        expect(avatarResponse.status).toBe(200);
        expect(avatarResponse.data.data.avatarId).toBeDefined();
    });

    test("Admin is able to change avatar url", async () => {
        const response = await axios.put(`${BACKEND_URL}/api/v1/admin/element/${elementId}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        expect(response.status).toBe(200);
    });

    afterAll(async() => {

        const res = await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        expect(res.status).toBe(200);
    });
});

describe("Web socket endpoint", () => {
    let adminId;
    let adminToken;
    let userId;
    let userToken;
    let elementId;
    let mapId;
    let spaceId;
    let ws1, ws2;
    let ws1Messages = [];
    let ws2Messages = [];
    let userX;
    let userY;
    let adminX;
    let adminY;

    function waitForAndPopLatestMessage(messageArray) {
        return new Promise(resolve => {
            if (messageArray.length > 0) {
                resolve(messageArray.shift())
            } else {
                let interval = setInterval(() => {
                    if (messageArray.length > 0) {
                        resolve(messageArray.shift())
                        clearInterval(interval)
                    }
                }, 100)
            }
        })
    }

    async function setupHTTP() {
        //admin sign-up
        const usernameAdmin = `admin-${Math.floor(Math.random() * 10)}`;
        const password = "12345";

        const adminSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: usernameAdmin,
            password,
            type: "admin"
        });

        

        adminId = adminSignupRes.data.data.userId;
        

        //admin sign-in
        const adminSigninRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: usernameAdmin,
            password
        });

        

        adminToken = adminSigninRes.data.data.token;
        

        //user sign-up
        const usernameUser = `sk-${Math.floor(Math.random() * 10)}`;

        const userSignupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: usernameUser,
            password,
            type: "user"
        });

        userId = userSignupRes.data.data.userId;

        //user sign-in
        const userSiginRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: usernameUser,
            password
        });

        userToken = userSiginRes.data.data.token;


        //create elements
        const element1Res = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        const element2Res = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });


        elementId = [element1Res.data.data.id, element2Res.data.data.id];

        //contruction of a map
        const mapRes = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: elementId[0],
                x: 20,
                y: 20
            }, {
                elementId: elementId[1],
                x: 18,
                y: 20
            }, {
                elementId: elementId[0],
                x: 19,
                y: 20
            }
            ]
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        mapId = mapRes.data.data.id;
        

        //construction of space
        const spaceRes = await axios.post(`${BACKEND_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        spaceId = spaceRes.data.data.spaceId;
    }

    async function setupWS() {
        ws1 = new WebSocket(WS_URL);

        //since the websocket recives messages faster than the chrome cpu can handle this is why we store the data in a array
        ws1.onmessage = (event) => {
            console.log("Got mssg for 1");
            ws1Messages.push(JSON.parse(event.data));
        }
        
        //waits indefinetilty till ws1 opens
        await new Promise(re => {
            ws1.onopen = re
        });
        
        ws2 = new WebSocket(WS_URL);

        ws2.onmessage = (event) => {
            console.log("Got mssg for 2");
            ws2Messages.push(JSON.parse(event.data));
        }

        await new Promise(re => {
            ws2.onopen = re;
        });
    }

    beforeAll(async () => {
        await axios.delete(`${BACKEND_URL}/api/v1/allTablesAfterTest`);
        await setupHTTP();
        await setupWS();
    });

    test("Get back an ack for joining the space", async () => {
        ws1.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": adminToken
            }
        }));

        const message1 = await waitForAndPopLatestMessage(ws1Messages);

        ws2.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": userToken
            }
        }));

        expect(message1.type).toBe("space-joined");

        const message2 = await waitForAndPopLatestMessage(ws2Messages);

        expect(message2.type).toBe("space-joined");

        const message3 = await waitForAndPopLatestMessage(ws1Messages);
        

        expect(message1.payload.users.length).toBe(0);
        expect(message2.payload.users.length).toBe(1);

        userX = message2.payload.spawn.x;
        userY = message2.payload.spawn.y;
        adminX = message1.payload.spawn.x;
        adminY = message1.payload.spawn.y;

        expect(message3.type).toBe("user-join");
        expect(message3.payload.x).toBe(userX);
        expect(message3.payload.y).toBe(userY);
        expect(message3.payload.userId).toBe(userId);
    });

    test("Whenever a user joins a space, all other users must recive a event", async () => {
 
        let ws3Messages = [];

        //http
        const newUserUsername = `sk-21-LastUser`;
        const newUserPassword = "Gunu@1234";

        const signupRes = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: newUserUsername,
            password: newUserPassword,
            type: "user"
        });

        const id = signupRes.data.data.userId;

        const siginRes = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: newUserUsername,
            password: newUserPassword
        });

        const token = siginRes.data.data.token;

        
        //ws
        const ws3 = new WebSocket(WS_URL);

        ws3.onmessage = (event) => {
            console.log("Got mssg for 3");
            ws3Messages.push(JSON.parse(event.data));
        }

        await new Promise(re => {
            ws3.onopen = re;
        });

        
        ws3.send(JSON.stringify({
            "type": "join",
            "payload": {
                "spaceId": spaceId,
                "token": token
            }
        }));

        

        const message1 = await waitForAndPopLatestMessage(ws1Messages);
        console.log(message1);
        
        const message2 = await waitForAndPopLatestMessage(ws2Messages);
        console.log(message2);

        const message3 = await waitForAndPopLatestMessage(ws3Messages);
        console.log(message3);

        

        let newX = message3.payload.spawn.x;
        let newY = message3.payload.spawn.y; 

        expect(message1.type).toBe("user-join");
        expect(message1.payload.userId).toBe(id);
        expect(message1.payload.x).toBe(newX);
        expect(message1.payload.y).toBe(newY);

        expect(message2.type).toBe("user-join");
        expect(message2.payload.userId).toBe(id);
        expect(message2.payload.x).toBe(newX);
        expect(message2.payload.y).toBe(newY);
    });

    test("Movement rejection on moving outside the map", async () => {
        ws1.send(JSON.stringify({
            "type": "move",
            "payload": {
                "x": 100000000,
                "y": 1000000
            }
        }));

        const message = await waitForAndPopLatestMessage(ws1Messages);

        

        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
        expect(message.payload.y).toBe(adminY);
    });

    test("Movement rejection on moving 2 blocks at the same time", async () => {
        ws1.send(JSON.stringify({
            "type": "move",
            "payload": {
                "x": adminX + 2,
                "y": adminY
            }
        }));

        const message = await waitForAndPopLatestMessage(ws1Messages);

        expect(message.type).toBe("movement-rejected");
        expect(message.payload.x).toBe(adminX);
    });

    //if error occurs then -> 2:48:38
    test("Correct movemnt = results in showcasing movemnt in x and y in both the users server", async () => {
        ws1.send(JSON.stringify({
            "type": "move",
            "payload": {
                "x": adminX + 1,
                "y": adminY
            }
        }));

        const messageRecivedByUser = await waitForAndPopLatestMessage(ws2Messages);

        expect(messageRecivedByUser.type).toBe("movement");
        expect(messageRecivedByUser.payload.x).toBe(adminX + 1);
        expect(messageRecivedByUser.payload.userId).toBe(adminId);
    });

    test("If one of the users leaves the other should sees it", async () => {
        ws1.close();

        const message = await waitForAndPopLatestMessage(ws2Messages);

        expect(message.type).toBe("user-left");
        expect(message.payload.userId).toBe(adminId);
    });

    
});
