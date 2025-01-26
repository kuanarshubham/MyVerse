const { default: axios, head } = require("axios");

const BACKEND_URL = "http://localhost:3000";

describe("Authentication endpoint", () => {
    test("User should be able to sign up with a unique username", async () => {
        const username = `sk-${Math.floor(Math.random() * 10)}`;
        const password = `1234`;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(resposne.statusCode).toBe(200);

        //if someone tries to sign-up using the same username

        const updatedResposne = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        expect(updatedResposne.statusCode).toBe(400);
    });

    test("User should be able to sign in with correct credentials", async () => {
        const username = `sk-${Math.floor(Math.random() * 10)}`;
        const password = `1234`;

        await axios(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        });

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(resposne.statusCode).toBe(200);
        expect(resposne.body.token).toBeDefined(200);
    })

    test("User tries sign-in with invalid credentials", async () => {
        let username = `12345`;
        let password = `1234`;

        const res = await axios(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(res.statusCode).toBe(400);

        username = `sk-${Math.floor(Math.random() * 10)}`;
        password = `invalid_passowrd`;

        const updatedRes = await axios(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(updatedRes.statusCode).toBe(400);
    });

    test("User tries sign-in with empty feild(s)", async () => {
        const username = "";
        const password = `1234`;

        const res = await axios(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        expect(res.statusCode).toBe(400);

        const username1 = `sk-${Math.floor(Math.random() * 10)}`;
        const password1 = "";

        const res1 = await axios(`${BACKEND_URL}/api/v1/signin`, {
            username: username1,
            password: password1
        });

        expect(res1.statusCode).toBe(400);

        const username2 = `sk-${Math.floor(Math.random() * 10)}`;
        const password2 = `invalid-password`;

        const res2 = await axios(`${BACKEND_URL}/api/v1/signin`, {
            username: username2,
            password: password2
        });

        expect(res2.statusCode).toBe(400);
    });
});

describe("User metadata endpoint", () => {
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

        token = resposne.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.avatarId;
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

        expect(response.statusCode).toBe(400)
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

        expect(response.statusCode).toBe(200);
    });

    test("User can't update their metadata beacuse of not authorization header", async () => {
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
            avatarId
        });

        expect(response.statusCode).toBe(403);
    });
});

describe("User avatar information", () => {
    let token, avatarId, userId;
    beforeAll(async () => {
        const username = `sk-${Math.floor(Math.random() * 10)}`;
        const password = "1234";

        const responseSignup = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: "admin"
        });

        userId = responseSignup.userId;

        const resposne = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        token = resposne.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.avatarId;
    });

    test("Get avatar information for the user", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);

        expect(response.data.avatars.length).toBe(1);
        expect(response.data.avatars[0].userId).toBe(userId);
    });

    test("Get all avatars avaibale", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/avatars`);

        expect(response.data.avatars).not.toBe(0);

        const currAvatar = response.find(x => x.id);

        expect(currAvatar.length).toBeDefined();
    })
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

        adminToken = resposne.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.avatarId;

        const element1 = {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not
        }

        const responseElement1 = await axios.post(`${BACKEND_URL} /api/v1/admin/element`, element1, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        const responseElement2 = await axios.post(`${BACKEND_URL} /api/v1/admin/element`, element2, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        elementId = [responseElement1.id, responseElement2.id];

        const responseForMap = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: responseElement1.id,
                x: 20,
                y: 20
            },
            {
                elementId: responseElement2.id,
                x: 40,
                y: 50
            }]
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        mapId = responseForMap.id;


        //USER

        const userUsername = `user-${Math.floor(Math.random() * 10)}`;
        const userPasswod = '12345';

        const userResponseSignup = await axios.post(`${BACKEND_URL}/api/v1/signip`, {
            username: userUsername,
            password: userPasswod,
            type: "user"
        });

        userId = userResponseSignup.data.id;

        const userResponseSigin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: userUsername,
            password: userPasswod
        });

        userToken = userResponseSigin.data.token;
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

        expect(response.spaceId).toBeDefined();
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

        expect(response.spaceId).toBeDefined();
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

        expect(response.statusCode).toBe(400);
    });

    test("User is unable to delete a map that doesn't exist", async () => {
        const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomInvalidMapId`,
            {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

        expect(response.statusCode).toBe(400);
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

        expect(user1TriesToDeleteSpaceMadeByUser2.statusCode).toBe(400);
    });

    test("Admin has no space initially", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/all`, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        expect(response.data.spaces.length).toBe(0);
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

        expect(getAllExistingSpaces.data.spaces.length).toBe(1);

        const foundSpace = getAllExistingSpaces.data.find(x => x === response.data.spaceId);

        expect(foundSpace).toBeDefined();
    })
});

describe("Arena informatin", () => {
    let userToken, adminToken, avatarId, userId, adminId, mapId, elementId, spaceId;

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

        adminToken = resposne.data.token;

        const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
            "name": "Timmy"
        });

        avatarId = avatarResponse.avatarId;

        const element1 = {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not
        }

        const responseElement1 = await axios.post(`${BACKEND_URL} /api/v1/admin/element`, element1, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        const responseElement2 = await axios.post(`${BACKEND_URL} /api/v1/admin/element`, element2, {
            headers: {
                "Authorization": `Bearer ${adminToken}`
            }
        });

        elementId = [responseElement1.id, responseElement2.id];

        const responseForMap = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                elementId: responseElement1.id,
                x: 20,
                y: 20
            },
            {
                elementId: responseElement2.id,
                x: 40,
                y: 50
            }]
        }, {
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        });

        mapId = responseForMap.id;


        //USER

        const userUsername = `user-${Math.floor(Math.random() * 10)}`;
        const userPasswod = '12345';

        const userResponseSignup = await axios.post(`${BACKEND_URL}/api/v1/signip`, {
            username: userUsername,
            password: userPasswod,
            type: "user"
        });

        userId = userResponseSignup.data.id;

        const userResponseSigin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: userUsername,
            password: userPasswod
        });

        userToken = userResponseSigin.data.token;

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

        spaceId = spaceRes.data.spaceId;
    });

    test("Incorrect space id couldn't fetch the map", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/RandomeInvalidSpaceId`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(response.statusCode).toBe(400);
    });

    test("Correct spaceId fetches the correct map with elements", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(response.data).toBeDefined();
        expect(response.data.elements.length).toBe(2);
        expect(response.data.dimensions).toBe("200x400");
    });

    test("Delete an element from user space", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        await axios.delete(`${BACKEND_URL}/api/v1/space/element`, {
            spaceId: spaceId,
            elementId: response.data.elements[0].id
        }, 
        {
            headers: {
                Authorization:  `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.data).toBeDefined();
        expect(newResponse.data.elements.length).toBe(1);
    });

    test("Add an element into the user space", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": elementId[1],
            "spaceId": "123",
            "x": 50,
            "y": 20
        }, 
        {
            headers: {
                Authorization:  `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.data).toBeDefined();
        expect(newResponse.data.elements.length).toBe(3);
    });

    test("Add an element into the user space ouside the specified dimensions", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        await axios.post(`${BACKEND_URL}/api/v1/space/element`, {
            "elementId": elementId[1],
            "spaceId": "123",
            "x": 1000000000000,
            "y": 9999999999999
        }, 
        {
            headers: {
                Authorization:  `Bearer ${userToken}`
            }
        });

        const newResponse = await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`, {
            headers: {
                Authorization: `Bearer ${userToken}`
            }
        });

        expect(newResponse.statusCode).toBe(404);
    });
});

describe("Create an element", () => {
    let adminId;
    let adminToken;
    let userId;
    let userToken;

    beforeAll(async() => {
        const adminUsername = `admin-${Math.floor(Math.random()*10)}`;
        const adminPassword = "12345";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: adminUsername,
            password: adminPassword,
            type: "admin"
        });

        const signinResAdmin = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        });

        adminToken = signinResAdmin.data.token;


        const userUsername = `sk-${Math.floor(Math.random()*10)}`;
        const userPassword = "12345";

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username: userUsername,
            password: userPassword,
            type: "user"
        });

        const signinResUser = await axios.post(`${BACKEND_URL}/api/v1/sigin`, {
            username: userUsername,
            password: userPassword
        });
    })
})