/**
 * Cameroon administrative divisions:
 * Region → Division → Subdivision
 */

export interface Subdivision {
    name: string;
}

export interface Division {
    name: string;
    subdivisions: Subdivision[];
}

export interface Region {
    name: string;
    divisions: Division[];
}

export const cameroonRegions: Region[] = [
    {
        name: 'Adamawa / Adamaoua',
        divisions: [
            {
                name: 'Djérem',
                subdivisions: [
                    { name: 'Tibati' },
                    { name: 'Ngaoundal' },
                ],
            },
            {
                name: 'Faro-et-Déo',
                subdivisions: [
                    { name: 'Tignère' },
                    { name: 'Galim-Tignère' },
                    { name: 'Kontcha' },
                    { name: 'Mayo-Baléo' },
                ],
            },
            {
                name: 'Mayo-Banyo',
                subdivisions: [
                    { name: 'Banyo' },
                    { name: 'Mayo-Darlé' },
                    { name: 'Bankim' },
                ],
            },
            {
                name: 'Mbéré',
                subdivisions: [
                    { name: 'Meiganga' },
                    { name: 'Djohong' },
                    { name: 'Dir' },
                    { name: 'Ngaoui' },
                ],
            },
            {
                name: 'Vina',
                subdivisions: [
                    { name: 'Ngaoundéré 1er' },
                    { name: 'Ngaoundéré 2e' },
                    { name: 'Ngaoundéré 3e' },
                    { name: 'Belel' },
                    { name: 'Martap' },
                    { name: 'Nyambaka' },
                    { name: 'Mbé' },
                ],
            },
        ],
    },
    {
        name: 'Centre / Center',
        divisions: [
            {
                name: 'Haute-Sanaga',
                subdivisions: [
                    { name: 'Nanga-Eboko' },
                    { name: 'Mbandjock' },
                    { name: 'Minta' },
                    { name: 'Nkoteng' },
                    { name: 'Bibey' },
                    { name: 'Lembe-Yezoum' },
                    { name: 'Nsem' },
                ],
            },
            {
                name: 'Lekié',
                subdivisions: [
                    { name: 'Monatélé' },
                    { name: 'Obala' },
                    { name: 'Batchenga' },
                    { name: 'Elig-Mfomo' },
                    { name: 'Ebebda' },
                    { name: 'Evodoula' },
                    { name: 'Lobo' },
                    { name: 'Okola' },
                    { name: 'Sa\'a' },
                ],
            },
            {
                name: 'Mbam-et-Inoubou',
                subdivisions: [
                    { name: 'Bafia' },
                    { name: 'Bokito' },
                    { name: 'Deuk' },
                    { name: 'Kiiki' },
                    { name: 'Kon-Yambetta' },
                    { name: 'Makenene' },
                    { name: 'Ndikiniméki' },
                    { name: 'Nitoukou' },
                    { name: 'Ombessa' },
                ],
            },
            {
                name: 'Mbam-et-Kim',
                subdivisions: [
                    { name: 'Ntui' },
                    { name: 'Mbangassina' },
                    { name: 'Yoko' },
                    { name: 'Ngambe-Tikar' },
                    { name: 'Ngoro' },
                ],
            },
            {
                name: 'Méfou-et-Afamba',
                subdivisions: [
                    { name: 'Mfou' },
                    { name: 'Esse' },
                    { name: 'Awae' },
                    { name: 'Edzendouan' },
                    { name: 'Nkolafamba' },
                    { name: 'Soa' },
                ],
            },
            {
                name: 'Méfou-et-Akono',
                subdivisions: [
                    { name: 'Ngoumou' },
                    { name: 'Akono' },
                    { name: 'Bikok' },
                    { name: 'Mbankomo' },
                ],
            },
            {
                name: 'Mfoundi',
                subdivisions: [
                    { name: 'Yaoundé 1er' },
                    { name: 'Yaoundé 2e' },
                    { name: 'Yaoundé 3e' },
                    { name: 'Yaoundé 4e' },
                    { name: 'Yaoundé 5e' },
                    { name: 'Yaoundé 6e' },
                    { name: 'Yaoundé 7e' },
                ],
            },
            {
                name: 'Nyong-et-Kellé',
                subdivisions: [
                    { name: 'Éséka' },
                    { name: 'Biyouha' },
                    { name: 'Bot-Makak' },
                    { name: 'Dibang' },
                    { name: 'Makak' },
                    { name: 'Matomb' },
                    { name: 'Messondo' },
                    { name: 'Ngog-Mapubi' },
                ],
            },
            {
                name: 'Nyong-et-Mfoumou',
                subdivisions: [
                    { name: 'Akonolinga' },
                    { name: 'Ayos' },
                    { name: 'Endom' },
                    { name: 'Mengang' },
                    { name: 'Nyakokombo' },
                ],
            },
            {
                name: 'Nyong-et-So\'o',
                subdivisions: [
                    { name: 'Mbalmayo' },
                    { name: 'Akoeman' },
                    { name: 'Dzeng' },
                    { name: 'Mengueme' },
                    { name: 'Ngomedzap' },
                    { name: 'Nkolmetet' },
                ],
            },
        ],
    },
    {
        name: 'East / Est',
        divisions: [
            {
                name: 'Boumba-et-Ngoko',
                subdivisions: [
                    { name: 'Yokadouma' },
                    { name: 'Gari-Gombo' },
                    { name: 'Moloundou' },
                    { name: 'Salapoumbé' },
                ],
            },
            {
                name: 'Haut-Nyong',
                subdivisions: [
                    { name: 'Abong-Mbang' },
                    { name: 'Angossas' },
                    { name: 'Atok' },
                    { name: 'Dimako' },
                    { name: 'Doumaintang' },
                    { name: 'Doumé' },
                    { name: 'Lomié' },
                    { name: 'Mboma' },
                    { name: 'Messamena' },
                    { name: 'Messok' },
                    { name: 'Mindourou' },
                    { name: 'Ngoyla' },
                    { name: 'Somalomo' },
                ],
            },
            {
                name: 'Kadey',
                subdivisions: [
                    { name: 'Batouri' },
                    { name: 'Kentzou' },
                    { name: 'Kette' },
                    { name: 'Mbang' },
                    { name: 'Ndelele' },
                    { name: 'Nguelemedouka' },
                    { name: 'Ouli' },
                ],
            },
            {
                name: 'Lom-et-Djérem',
                subdivisions: [
                    { name: 'Bertoua 1er' },
                    { name: 'Bertoua 2e' },
                    { name: 'Bétaré-Oya' },
                    { name: 'Belabo' },
                    { name: 'Diang' },
                    { name: 'Garoua-Boulaï' },
                    { name: 'Mandjou' },
                    { name: 'Ngoura' },
                ],
            },
        ],
    },
    {
        name: 'Far North / Extrême-Nord',
        divisions: [
            {
                name: 'Diamaré',
                subdivisions: [
                    { name: 'Maroua 1er' },
                    { name: 'Maroua 2e' },
                    { name: 'Maroua 3e' },
                    { name: 'Bogo' },
                    { name: 'Dargala' },
                    { name: 'Gazawa' },
                    { name: 'Meri' },
                    { name: 'Ndoukoula' },
                    { name: 'Pétté' },
                ],
            },
            {
                name: 'Logone-et-Chari',
                subdivisions: [
                    { name: 'Kousséri' },
                    { name: 'Blangoua' },
                    { name: 'Darak' },
                    { name: 'Fotokol' },
                    { name: 'Goulfey' },
                    { name: 'Hile-Alifa' },
                    { name: 'Logone-Birni' },
                    { name: 'Makary' },
                    { name: 'Waza' },
                    { name: 'Zina' },
                ],
            },
            {
                name: 'Mayo-Danay',
                subdivisions: [
                    { name: 'Yagoua' },
                    { name: 'Datcheka' },
                    { name: 'Guémé' },
                    { name: 'Guéré' },
                    { name: 'Kai-Kai' },
                    { name: 'Kar-Hay' },
                    { name: 'Maga' },
                    { name: 'Tchatibali' },
                    { name: 'Vele' },
                    { name: 'Wina' },
                ],
            },
            {
                name: 'Mayo-Kani',
                subdivisions: [
                    { name: 'Kaélé' },
                    { name: 'Guidiguis' },
                    { name: 'Mindif' },
                    { name: 'Moulvoudaye' },
                    { name: 'Moutourwa' },
                    { name: 'Touloum' },
                    { name: 'Porhi' },
                    { name: 'Taibong' },
                ],
            },
            {
                name: 'Mayo-Sava',
                subdivisions: [
                    { name: 'Mora' },
                    { name: 'Kolofata' },
                    { name: 'Tokombéré' },
                ],
            },
            {
                name: 'Mayo-Tsanaga',
                subdivisions: [
                    { name: 'Mokolo' },
                    { name: 'Bourha' },
                    { name: 'Hina' },
                    { name: 'Koza' },
                    { name: 'Mogodé' },
                    { name: 'Soulédé-Roua' },
                ],
            },
        ],
    },
    {
        name: 'Littoral',
        divisions: [
            {
                name: 'Moungo',
                subdivisions: [
                    { name: 'Nkongsamba 1er' },
                    { name: 'Nkongsamba 2e' },
                    { name: 'Nkongsamba 3e' },
                    { name: 'Bare' },
                    { name: 'Bonaléa' },
                    { name: 'Dibombari' },
                    { name: 'Loum' },
                    { name: 'Manjo' },
                    { name: 'Mbanga' },
                    { name: 'Melong' },
                    { name: 'Mombo' },
                    { name: 'Njombé-Penja' },
                ],
            },
            {
                name: 'Nkam',
                subdivisions: [
                    { name: 'Yabassi' },
                    { name: 'Nkondjock' },
                    { name: 'Nord-Makombé' },
                    { name: 'Yingui' },
                ],
            },
            {
                name: 'Sanaga-Maritime',
                subdivisions: [
                    { name: 'Édéa 1er' },
                    { name: 'Édéa 2e' },
                    { name: 'Dizangué' },
                    { name: 'Mouanko' },
                    { name: 'Massock-Songloulou' },
                    { name: 'Ndom' },
                    { name: 'Ngambé' },
                    { name: 'Nyanon' },
                    { name: 'Pouma' },
                ],
            },
            {
                name: 'Wouri',
                subdivisions: [
                    { name: 'Douala 1er' },
                    { name: 'Douala 2e' },
                    { name: 'Douala 3e' },
                    { name: 'Douala 4e' },
                    { name: 'Douala 5e' },
                    { name: 'Douala 6e' },
                    { name: 'Manoka' },
                ],
            },
        ],
    },
    {
        name: 'North / Nord',
        divisions: [
            {
                name: 'Bénoué',
                subdivisions: [
                    { name: 'Garoua 1er' },
                    { name: 'Garoua 2e' },
                    { name: 'Garoua 3e' },
                    { name: 'Bashéo' },
                    { name: 'Bibémi' },
                    { name: 'Dembo' },
                    { name: 'Lagdo' },
                    { name: 'Pitoa' },
                    { name: 'Touroua' },
                ],
            },
            {
                name: 'Faro',
                subdivisions: [
                    { name: 'Poli' },
                    { name: 'Béka' },
                ],
            },
            {
                name: 'Mayo-Louti',
                subdivisions: [
                    { name: 'Guider' },
                    { name: 'Figuil' },
                    { name: 'Mayo-Oulo' },
                ],
            },
            {
                name: 'Mayo-Rey',
                subdivisions: [
                    { name: 'Tcholliré' },
                    { name: 'Madingring' },
                    { name: 'Rey-Bouba' },
                    { name: 'Touboro' },
                ],
            },
        ],
    },
    {
        name: 'Northwest / Nord-Ouest',
        divisions: [
            {
                name: 'Boyo',
                subdivisions: [
                    { name: 'Fundong' },
                    { name: 'Belo' },
                    { name: 'Njinikom' },
                ],
            },
            {
                name: 'Bui',
                subdivisions: [
                    { name: 'Kumbo' },
                    { name: 'Jakiri' },
                    { name: 'Mbiame' },
                    { name: 'Nkum' },
                    { name: 'Noni' },
                    { name: 'Oku' },
                ],
            },
            {
                name: 'Donga-Mantung',
                subdivisions: [
                    { name: 'Nkambé' },
                    { name: 'Ako' },
                    { name: 'Misaje' },
                    { name: 'Ndu' },
                    { name: 'Nwa' },
                ],
            },
            {
                name: 'Menchum',
                subdivisions: [
                    { name: 'Wum' },
                    { name: 'Benakuma' },
                    { name: 'Furu-Awa' },
                    { name: 'Fungom' },
                    { name: 'Zhoa' },
                ],
            },
            {
                name: 'Mezam',
                subdivisions: [
                    { name: 'Bamenda 1er' },
                    { name: 'Bamenda 2e' },
                    { name: 'Bamenda 3e' },
                    { name: 'Bafut' },
                    { name: 'Bali' },
                    { name: 'Santa' },
                    { name: 'Tubah' },
                ],
            },
            {
                name: 'Momo',
                subdivisions: [
                    { name: 'Mbengwi' },
                    { name: 'Andek' },
                    { name: 'Batibo' },
                    { name: 'Njikwa' },
                    { name: 'Widikum' },
                ],
            },
            {
                name: 'Ngo-Ketunjia',
                subdivisions: [
                    { name: 'Ndop' },
                    { name: 'Babessi' },
                    { name: 'Balikumbat' },
                ],
            },
        ],
    },
    {
        name: 'South / Sud',
        divisions: [
            {
                name: 'Dja-et-Lobo',
                subdivisions: [
                    { name: 'Sangmélima' },
                    { name: 'Bengbis' },
                    { name: 'Djoum' },
                    { name: 'Meyomessala' },
                    { name: 'Meyomessi' },
                    { name: 'Mintom' },
                    { name: 'Oveng' },
                    { name: 'Zoétélé' },
                ],
            },
            {
                name: 'Mvila',
                subdivisions: [
                    { name: 'Ebolowa 1er' },
                    { name: 'Ebolowa 2e' },
                    { name: 'Biwong-Bane' },
                    { name: 'Efoulan' },
                    { name: 'Mengong' },
                    { name: 'Mvangan' },
                    { name: 'Ngoulemakong' },
                ],
            },
            {
                name: 'Océan',
                subdivisions: [
                    { name: 'Kribi 1er' },
                    { name: 'Kribi 2e' },
                    { name: 'Akom II' },
                    { name: 'Bipindi' },
                    { name: 'Campo' },
                    { name: 'Lokoundjé' },
                    { name: 'Lolodorf' },
                    { name: 'Mvengue' },
                    { name: 'Niété' },
                ],
            },
            {
                name: 'Vallée-du-Ntem',
                subdivisions: [
                    { name: 'Ambam' },
                    { name: 'Ma\'an' },
                    { name: 'Olamze' },
                ],
            },
        ],
    },
    {
        name: 'Southwest / Sud-Ouest',
        divisions: [
            {
                name: 'Fako',
                subdivisions: [
                    { name: 'Buea' },
                    { name: 'Limbe 1er' },
                    { name: 'Limbe 2e' },
                    { name: 'Limbe 3e' },
                    { name: 'Tiko' },
                    { name: 'Muyuka' },
                    { name: 'West-Coast' },
                    { name: 'Idenau' },
                ],
            },
            {
                name: 'Koupé-Manengouba',
                subdivisions: [
                    { name: 'Bangem' },
                    { name: 'Nguti' },
                    { name: 'Tombel' },
                    { name: 'Nkongle' },
                    { name: 'Ninong' },
                ],
            },
            {
                name: 'Lebialem',
                subdivisions: [
                    { name: 'Menji' },
                    { name: 'Alou' },
                    { name: 'Fontem' },
                    { name: 'Wabane' },
                ],
            },
            {
                name: 'Manyu',
                subdivisions: [
                    { name: 'Mamfe' },
                    { name: 'Akwaya' },
                    { name: 'Eyumojock' },
                    { name: 'Tinto' },
                    { name: 'Upper-Bayang' },
                ],
            },
            {
                name: 'Meme',
                subdivisions: [
                    { name: 'Kumba 1er' },
                    { name: 'Kumba 2e' },
                    { name: 'Kumba 3e' },
                    { name: 'Konye' },
                    { name: 'Mbonge' },
                ],
            },
            {
                name: 'Ndian',
                subdivisions: [
                    { name: 'Mundemba' },
                    { name: 'Bamusso' },
                    { name: 'Dikome-Balue' },
                    { name: 'Ekondo-Titi' },
                    { name: 'Idabato' },
                    { name: 'Isangele' },
                    { name: 'Kombo-Abédimo' },
                    { name: 'Kombo-Itindi' },
                    { name: 'Toko' },
                ],
            },
        ],
    },
    {
        name: 'West / Ouest',
        divisions: [
            {
                name: 'Bamboutos',
                subdivisions: [
                    { name: 'Mbouda' },
                    { name: 'Batcham' },
                    { name: 'Galim' },
                    { name: 'Wabane' },
                ],
            },
            {
                name: 'Haut-Nkam',
                subdivisions: [
                    { name: 'Bafang' },
                    { name: 'Bana' },
                    { name: 'Bandja' },
                    { name: 'Banka' },
                    { name: 'Kekem' },
                ],
            },
            {
                name: 'Hauts-Plateaux',
                subdivisions: [
                    { name: 'Baham' },
                    { name: 'Bamendjou' },
                    { name: 'Bangou' },
                    { name: 'Batié' },
                ],
            },
            {
                name: 'Koung-Khi',
                subdivisions: [
                    { name: 'Bayangam' },
                    { name: 'Bangante' },
                    { name: 'Poumougne' },
                ],
            },
            {
                name: 'Menoua',
                subdivisions: [
                    { name: 'Dschang' },
                    { name: 'Fokoué' },
                    { name: 'Fongo-Tongo' },
                    { name: 'Nkong-Ni' },
                    { name: 'Penka-Michel' },
                    { name: 'Santchou' },
                ],
            },
            {
                name: 'Mifi',
                subdivisions: [
                    { name: 'Bafoussam 1er' },
                    { name: 'Bafoussam 2e' },
                    { name: 'Bafoussam 3e' },
                ],
            },
            {
                name: 'Ndé',
                subdivisions: [
                    { name: 'Bangangté' },
                    { name: 'Bassamba' },
                    { name: 'Bazou' },
                    { name: 'Tonga' },
                ],
            },
            {
                name: 'Noun',
                subdivisions: [
                    { name: 'Foumban' },
                    { name: 'Foumbot' },
                    { name: 'Koutaba' },
                    { name: 'Kouoptamo' },
                    { name: 'Magba' },
                    { name: 'Malantouen' },
                    { name: 'Massangam' },
                    { name: 'Njimom' },
                    { name: 'Njimon' },
                ],
            },
        ],
    },
];
