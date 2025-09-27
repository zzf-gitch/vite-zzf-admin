import request from '@/utils/request';

// 上传头像
export async function upload_avatar(file) {
    const formData = new FormData();
    formData.append('image', file.file);
    formData.append('type', file.type);
    const res = await request.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    if (res.data.code === 0) {
        return res.data.message;
    }
    return Promise.reject(new Error(res.data.message));
}
