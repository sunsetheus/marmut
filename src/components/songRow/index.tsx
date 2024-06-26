"use client"

import { getKontenById } from "@/actions/konten";
import { getArtistNameById } from "@/actions/artist";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlay } from "react-icons/fi";
import { HiOutlineEye, HiOutlineInformationCircle, HiOutlinePencilAlt, HiOutlinePlay, HiOutlineTrash } from "react-icons/hi";
import { PiPlay } from "react-icons/pi";
import { addAkunPlayPlaylist } from "@/actions/playlist";
import { useAuth } from "@/contexts";

interface KontenProps {
    id: string;
    judul: string;
    tanggal_rilis: Date;
    tahun: number;
    durasi: number;
  }

interface SongProps {
    id_konten: string;
    id_artist: string;
    id_album: string;
    total_play: number;
    total_download: number;
}

interface SongRowProps {
    data: SongProps
    handleDeletePlaylistSong: (idSong: string) => void;
    isOwner: boolean
    handlePlaySong: (idSong: string) => void
}

export const SongRow: React.FC<SongRowProps> = ({
    data, handleDeletePlaylistSong, isOwner, handlePlaySong
}) => {

    const [artis, setArtis] = useState<string>('');
    const [konten, setKonten] = useState<KontenProps>({} as any);

    const router = useRouter();
    const pathname = usePathname();

    const getSongData = async () => {
        try {
            const kontenRes = await getKontenById(data.id_konten) as any as KontenProps;
            const artistRes = await getArtistNameById(data.id_artist);

            setKonten(kontenRes as any)
            setArtis(artistRes as string);

        } catch (error) {

        }
    }

    useEffect(() => {
        getSongData()
    }, [])

    useEffect(() => {
        getSongData()
    }, [data])

    return (
        <div className="grid grid-cols-6 w-full bg-marmut-green-400 p-[10px] hover:bg-marmut-green-600 text-marmut-000 font-medium rounded-md items-center">
            <div className="col-span-2 flex-row items-center px-2">
                <text>{konten.judul}</text>
            </div>

            <div className="col-span-2 flex-row items-center px-2">
                <text>{artis}</text>
            </div>

            <div className="col-span-1 flex flex-row items-center gap-1 px-2">
                {(() => {
                    const totalDurasi = konten.durasi;
                    const hours = Math.floor(totalDurasi / 60);
                    const minutes = totalDurasi % 60;
                    return (
                        <>
                            {hours > 0 && <span className="mr-[1px]">{hours} jam</span>}
                            <span className="mr-[1px]">{minutes} menit</span>
                        </>
                    );
                })()}
            </div>

            <div className="col-span-1 flex-row items-center px-2 flex gap-[6px] justify-center">
                <button className="bg-marmut-700 text-marmut-100 p-[7px] rounded-md" onClick={() => router.push(`/play/${konten.id}`)}>
                    <HiOutlineInformationCircle size={21}/> 
                </button>

                <button className="bg-marmut-brown-500 text-marmut-light-brown-000 p-[7px] rounded-md" onClick={() => handlePlaySong(konten.id)}>
                    <PiPlay size={19}/>
                </button>

                {isOwner && <button className="bg-red-600 text-red-100 p-[7px] rounded-md" onClick={() => handleDeletePlaylistSong(konten.id)}>
                    <HiOutlineTrash size={21}/>
                </button>}
            </div>
        </div>
    )
}