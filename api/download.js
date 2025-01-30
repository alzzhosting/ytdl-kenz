import ytdl from 'ytdl-core';

export default async function handler(req, res) {
    const { url, res: resolution } = req.query;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL video tidak ditemukan!' });
    }

    try {
        // Ambil informasi video dan filter berdasarkan resolusi
        const info = await ytdl.getInfo(url);
        const formats = ytdl.filterFormats(info.formats, 'videoandaudio');

        let selectedFormat = formats.find(format => format.qualityLabel === resolution);

        // Jika format yang diminta tidak ada, ambil format terbaik yang ada
        if (!selectedFormat) {
            selectedFormat = formats[0];
        }

        // Kirimkan URL download ke frontend
        res.status(200).json({
            success: true,
            download_url: selectedFormat.url
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Terjadi kesalahan saat mengambil video.' });
    }
}
