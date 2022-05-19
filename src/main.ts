import { AUDIO_CODECS } from './audio-codecs';
import { CODECS } from './codecs';
import { getAllAV1Codecs } from './codecs-video-av1';
import { getAllAVCCodecs } from './codecs-video-avc';
import { getAllHEVCCodecs } from './codecs-video-hevc';
import { getAllVP9Codecs } from './codecs-video-vp9';
import { MIMES } from './mines';

function checksum(obj: { [key: string]: { m: string; v: string } }) {
    return fastStringChecksum(
        Object.values(obj)
            .map(({ m, v }) => `${m}${v}`)
            .reduce((acc, val) => `${val}-${acc}`, '')
    );
}

function fastStringChecksum(s: string) {
    let chk = 0x12345678;
    const len = s.length;
    for (let i = 0; i < len; i++) {
        chk += s.charCodeAt(i) * (i + 1);
    }

    return (chk & 0xffffffff).toString(16);
}

function checkSupport(mime: string) {
    const video = document.createElement('video');
    let mediasource_result: string = '';
    const video_result = video.canPlayType(mime);
    try {
        mediasource_result = MediaSource.isTypeSupported(mime).toString();
    } catch (e: unknown) {
        if (typeof e === 'string') {
            mediasource_result = e;
        } else if (e instanceof Error) {
            mediasource_result = e.message;
        }
    }
    return { m: mediasource_result, v: video_result };
}

export function getCodecFingerPrint() {
    const mime = checkCodecGroup(MIMES.map((codec: string) => ({ codec })));
    const codecs = checkCodecGroup(CODECS, true);
    const audioCodecs = checkCodecGroup(AUDIO_CODECS, true);
    const avccCodecs = checkCodecGroup(getAllAVCCodecs(), true);
    const av1Codecs = checkCodecGroup(getAllAV1Codecs(), true);
    const vp9Codecs = checkCodecGroup(getAllVP9Codecs(), true);
    const hvecCodecs = checkCodecGroup(getAllHEVCCodecs(), true);

    console.log('mime', mime, checksum(mime));
    console.log('codecs', codecs, checksum(codecs));
    console.log('audioCodecs', audioCodecs, checksum(audioCodecs));
    console.log('avccCodecs', avccCodecs, checksum(avccCodecs));
    console.log('av1Codecs', av1Codecs, checksum(av1Codecs));
    console.log('vp9Codecs', vp9Codecs, checksum(vp9Codecs));
    console.log('hvecCodecs', hvecCodecs, checksum(hvecCodecs));
}

function checkCodecGroup(
    codecs: Array<{ codec: string }>,
    formCompleteCodecString: boolean = false
) {
    return codecs.reduce<{
        [k: string]: { m: string; v: string };
    }>((acc, { codec }) => {
        if (formCompleteCodecString) {
            codec = `video/mp4; codecs="${codec}"`;
        }
        acc[codec] = checkSupport(codec);
        return acc;
    }, {});
}

getCodecFingerPrint();
