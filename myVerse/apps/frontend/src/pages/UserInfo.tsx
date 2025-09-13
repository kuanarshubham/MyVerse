import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppSelector } from '@/store/hooks';
import { BASE_HTTP_URL } from '@/utils/constants.utils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Define a type for the avatar data from your API
interface Avatar {
    id: string;
    imageUrl: string;
    name: string;
}

const UserInfo = () => {
    const token = useAppSelector(s => s.auth.token);
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    // 1. Fetch all available avatars when the component loads
    useEffect(() => {
        if (!token) return;

        const fetchAvatars = async () => {
            try {
                const response = await axios.get(`${BASE_HTTP_URL}/avatars`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAvatars(response.data.data.avatar);
            } catch (error) {
                console.error("Failed to fetch avatars:", error);
            }
        };

        fetchAvatars();
    }, [token]);

    // 2. Handle saving the user's choice
    const handleSaveAvatar = async () => {
        if (!selectedAvatar || !token) {
            alert("Please select an avatar.");
            return;
        }

        try {
            await axios.post(`${BASE_HTTP_URL}/user/metadata`, 
                { avatarId: selectedAvatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Failed to save avatar:", error);
            alert("Failed to save avatar.");
        }
    };

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Choose Your Avatar</h1>
            
            {/* 3. Render the list of avatars */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 mb-8">
                {avatars.map((avatar) => (
                    <Card 
                        key={avatar.id}
                        className={`p-2 cursor-pointer transition-all ${selectedAvatar === avatar.id ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedAvatar(avatar.id)}
                    >
                        <img src={avatar.imageUrl} alt={avatar.name} className="w-full h-full object-contain rounded-md" />
                    </Card>
                ))}
            </div>

            <Button onClick={handleSaveAvatar} disabled={!selectedAvatar}>
                Save Choice
            </Button>
        </div>
    );
}

export default UserInfo;