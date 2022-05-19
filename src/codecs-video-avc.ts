export function getAllAVCCodecs() {
    const AVC_PROFILES_DESC = [
        //{ constrained_set0_flag: true },
        //{ constrained_set1_flag: true },
        //{ constrained_set2_flag: true },
        {
            profile_idc: 66,
            description: 'Baseline',
            constrained_set0_flag: false,
            constrained_set2_flag: false,
        },
        {
            profile_idc: 66,
            description: 'Constrained Baseline',
            constrained_set1_flag: true,
        },
        { profile_idc: 77, description: 'Main' },
        {
            profile_idc: 77,
            description: 'Constrained Main',
            constrained_set1_flag: true,
        },
        { profile_idc: 88, description: 'Extended' },
        { profile_idc: 100, description: 'High', constrained_set4_flag: false },
        {
            profile_idc: 100,
            description: 'High Progressive',
            constrained_set4_flag: true,
        },
        {
            profile_idc: 100,
            description: 'Constrained High',
            constrained_set4_flag: true,
            constrained_set5_flag: true,
        },
        { profile_idc: 110, description: 'High 10' },
        {
            profile_idc: 110,
            description: 'High 10 Intra',
            constrained_set3_flag: true,
        },
        { profile_idc: 122, description: 'High 4:2:2' },
        {
            profile_idc: 122,
            description: 'High 4:2:2 Intra',
            constrained_set3_flag: true,
        },
        { profile_idc: 244, description: 'High 4:4:4 Predictive' },
        {
            profile_idc: 244,
            description: 'High 4:4:4 Intra',
            constrained_set3_flag: true,
        },
        { profile_idc: 44, description: 'CAVLC 4:4:4 Intra' },
    ];

    const AVC_PROFILES_IDC = [66, 77, 88, 100, 110, 122, 244, 44];
    const AVC_CONSTRAINTS = [0, 4, 8, 16, 32, 64, 128];
    const AVC_LEVELS = [
        10, 11, 12, 13, 20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 52,
    ];

    let sj;
    let sk;
    let sl;
    const mimes = [];
    for (const j in AVC_PROFILES_IDC) {
        sj = AVC_PROFILES_IDC[j].toString(16);
        if (sj.length == 1) sj = '0' + sj;
        for (const k in AVC_CONSTRAINTS) {
            sk = AVC_CONSTRAINTS[k].toString(16);
            if (sk.length == 1) sk = '0' + sk;

            let desc = '';
            for (let i in AVC_PROFILES_DESC) {
                if (AVC_PROFILES_IDC[j] == AVC_PROFILES_DESC[i].profile_idc) {
                    const c =
                        ((AVC_PROFILES_DESC[i].constrained_set0_flag ? 1 : 0) <<
                            7) |
                        ((AVC_PROFILES_DESC[i].constrained_set1_flag ? 1 : 0) <<
                            6) |
                        ((AVC_PROFILES_DESC[i].constrained_set2_flag ? 1 : 0) <<
                            5) |
                        ((AVC_PROFILES_DESC[i].constrained_set3_flag ? 1 : 0) <<
                            4) |
                        ((AVC_PROFILES_DESC[i].constrained_set4_flag ? 1 : 0) <<
                            3) |
                        ((AVC_PROFILES_DESC[i].constrained_set5_flag ? 1 : 0) <<
                            2);
                    if (c === AVC_CONSTRAINTS[k]) {
                        desc = AVC_PROFILES_DESC[i].description;
                        break;
                    }
                }
            }
            if (desc.length > 0) {
                for (const l in AVC_LEVELS) {
                    sl = AVC_LEVELS[l].toString(16);
                    if (sl.length == 1) sl = '0' + sl;
                    mimes.push({
                        codec: 'avc1.' + sj + sk + sl,
                        description:
                            'AVC ' + desc + ' Level ' + AVC_LEVELS[l] / 10,
                    });
                }
            }
        }
    }
    return mimes;
}
