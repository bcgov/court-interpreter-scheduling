import { parseDistanceFromGoogleApi } from 'src/utils';
import * as faker from 'faker';

export async function googleMapMock(addr1: string, addr2: string): Promise<string> {
  // mocking fetching data from Google Map Api
  await new Promise(res => setTimeout(res, 1000));
  const mock = mockData();
  return String(parseDistanceFromGoogleApi(mock));
}

function mockData() {
  return {
    geocoded_waypoints: [
      {
        geocoder_status: 'OK',
        place_id: 'ChIJr16tP7hzj1QRCIM7urybzyw',
        types: ['street_address'],
      },
      {
        geocoder_status: 'OK',
        place_id: 'ChIJFxRo0xmvYlQR8qqEsY1uQEs',
        types: ['courthouse', 'establishment', 'local_government_office', 'point_of_interest'],
      },
    ],
    routes: [
      {
        bounds: {
          northeast: {
            lat: 50.030786,
            lng: -123.365623,
          },
          southwest: {
            lat: 48.4531123,
            lng: -125.2827591,
          },
        },
        copyrights: 'Map data ©2021 Google',
        legs: [
          {
            distance: {
              text: '265 km',
              value: faker.random.number({ min: 100, max: 300 * 1000 }),
            },
            duration: {
              text: '3 hours 1 min',
              value: 10858,
            },
            end_address: '500 13th Ave, Campbell River, BC V9W 4G7, Canada',
            end_location: {
              lat: 50.0278962,
              lng: -125.2475232,
            },
            start_address: '1005 Karen Crescent, Victoria, BC V8X 3C7, Canada',
            start_location: {
              lat: 48.4681447,
              lng: -123.365623,
            },
            steps: [
              {
                distance: {
                  text: '0.2 km',
                  value: 176,
                },
                duration: {
                  text: '1 min',
                  value: 37,
                },
                end_location: {
                  lat: 48.4675729,
                  lng: -123.3677584,
                },
                html_instructions: 'Head <b>west</b> on <b>Karen Crescent</b> toward <b>Morgan St</b>',
                polyline: {
                  points: '{lyfHbz}oVLvB@R?BBTFb@JXDFHFLPBDBFFLBL@H@HBj@B`@JX',
                },
                start_location: {
                  lat: 48.4681447,
                  lng: -123.365623,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '73 m',
                  value: 73,
                },
                duration: {
                  text: '1 min',
                  value: 18,
                },
                end_location: {
                  lat: 48.4669367,
                  lng: -123.3675103,
                },
                html_instructions: 'Turn <b>left</b> at the 1st cross street onto <b>Morgan St</b>',
                maneuver: 'turn-left',
                polyline: {
                  points: 'iiyfHng~oVlAYn@W',
                },
                start_location: {
                  lat: 48.4675729,
                  lng: -123.3677584,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '0.1 km',
                  value: 135,
                },
                duration: {
                  text: '1 min',
                  value: 26,
                },
                end_location: {
                  lat: 48.46714430000001,
                  lng: -123.3657199,
                },
                html_instructions: 'Turn <b>left</b> onto <b>Ridgeway St</b>',
                maneuver: 'turn-left',
                polyline: {
                  points: 'keyfH|e~oVBE?GQaCMkBEs@Eu@',
                },
                start_location: {
                  lat: 48.4669367,
                  lng: -123.3675103,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '80 m',
                  value: 80,
                },
                duration: {
                  text: '1 min',
                  value: 17,
                },
                end_location: {
                  lat: 48.4664958,
                  lng: -123.3652623,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Tulsa Dr</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'sfyfHvz}oV|@s@BC|@c@',
                },
                start_location: {
                  lat: 48.46714430000001,
                  lng: -123.3657199,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '0.3 km',
                  value: 264,
                },
                duration: {
                  text: '1 min',
                  value: 42,
                },
                end_location: {
                  lat: 48.46618489999999,
                  lng: -123.3686744,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Greenridge Crescent</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'sbyfHzw}oVZnBVdBHf@J|@Dv@@L?L?L?JAPCXAFUzACZAT@L?BDTHT',
                },
                start_location: {
                  lat: 48.4664958,
                  lng: -123.3652623,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '0.4 km',
                  value: 390,
                },
                duration: {
                  text: '1 min',
                  value: 49,
                },
                end_location: {
                  lat: 48.4692446,
                  lng: -123.3710213,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Saanich Rd</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 's`yfHdm~oVq@dAq@~@oArAGHaAfA_@\\\\UL[P_B|@c@NSDE@MBUDo@Da@D',
                },
                start_location: {
                  lat: 48.46618489999999,
                  lng: -123.3686744,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '2.6 km',
                  value: 2640,
                },
                duration: {
                  text: '4 mins',
                  value: 234,
                },
                end_location: {
                  lat: 48.461322,
                  lng: -123.4030912,
                },
                html_instructions: 'Turn <b>left</b> onto <b>McKenzie Ave</b>',
                maneuver: 'turn-left',
                polyline: {
                  points:
                    'wsyfHz{~oVH|Af@~HBXLjBJhBLhB?FDl@R~CFt@Dr@Dp@Ad@Dj@FdAHnBFrAB`@FrANpBDpAF|@Fv@Hv@Ft@TnBTjBTjBDZTfBLlA@Rb@pEJjBP~CRrDHxAHhAHhAP`C^fFNxCD|@Br@BrA@X?FDzBBdBBdADzBBfBJvA?FFd@Fh@NpAVtAPt@Pj@Vx@DLJVf@dAR\\\\`@t@v@tADF@Bn@hAJRBBNV~CpFf@x@Z`@FHJHLZBBn@n@^\\\\lAhAPPf@b@j@j@j@t@^`@X\\\\@@',
                },
                start_location: {
                  lat: 48.4692446,
                  lng: -123.3710213,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '99.9 km',
                  value: 99902,
                },
                duration: {
                  text: '1 hour 15 mins',
                  value: 4497,
                },
                end_location: {
                  lat: 49.1204744,
                  lng: -123.9136726,
                },
                html_instructions:
                  'Merge onto <b>Rte 1 N</b>/<wbr/><b>Trans-Canada Hwy</b>/<wbr/><b>BC-1 N</b> via the ramp to <b>Nanaimo</b>',
                maneuver: 'ramp-right',
                polyline: {
                  points:
                    'gbxfHhdepVFHBBZb@h@v@HLLVBDLTPXNTLTJd@Hf@Br@En@ARO`EMtBIjBKp@a@fCc@pBa@lBk@zBOtAUdA[|@m@`BWt@}@vBy@rBq@jBgAlCYp@O^CHSj@M^K\\\\KZABI\\\\EPCLG^I\\\\Id@Ix@Gj@Gv@Er@Cp@Ar@?|@@`ABdA?H@z@DlBBdBBjB?tA?lBCtC?vA?v@@lB@~@FdF?ZFfD@hDAfB?t@Ab@EzL@zBDpCFhBNpDHjAHbAJhATpBRpCD^Z|BBPVbCBPFb@JhAFz@Fx@HjAFbADv@H~BFnAFjBHrAF`BRlEPvERnFHrBHvBNlDNhEJtCB^H`CBj@HrB@TDtA@NF`BJzBDtABr@DbAHbBFlBJzCHfC?@BdA@bAAt@?h@CdACz@El@KrBWnDAVKlBGbBEhAC|@?x@?Z?d@@dABbAF|A@\\\\NnCRjEVrE@b@?BB\\\\@J@t@DfA@nA?L@|@Ar@?bACfAIrAKdAUlB_@tB[dAIXGR[~@{@vBiCtF{@hBs@|AoAlCiAjCa@tA?@_@|AShAKx@Iv@En@CTGdAEv@AfAAzABpABx@?JLfBJfAJx@Jr@XzAFTPp@Tz@Vp@Tn@Xn@BHFNb@v@rA~BLXLRbAzAj@bAdAhBj@bAhAjBv@tAh@~@v@rAtE`IlAtBvEdILRZn@\\\\t@^z@Vn@Rj@FNPh@T~@Jb@Jn@Ln@Hv@Lz@DZDf@JbA`@`GZlEJdB\\\\fDHx@Jp@RnATdAR~@Ld@Ld@Rr@L`@Rj@Pd@Xp@jAxCz@vB`@jAXv@x@hDH^h@|CRjAL|@jAtHPdALr@VhBNlAPnBFx@@j@@p@Av@AXC`@Cb@C^E^Gd@Mv@Ij@u@nEMz@}@`Fg@hCMn@cAjFg@tCMt@Kr@AHW|A_@vBIp@OdA?JGz@Ev@CtA?nAB~ABv@F|@HdADVFd@BLTtAHb@FZTjAr@zC`@bBZ~@Jd@Ld@DNZvAN~@BTFl@BX@XFnA?~AE`BMhAQjAS`ACH]nAm@tAqAnCwAxCuAtC_@v@Wf@CH_AnBeA~BgAjBoC`GOX{@zAmDnHq@zAADQd@m@`B_AxCk@bCWhAShAWdA_@rBg@nCU~@Mn@EPGTGX?@ETGZi@tCAJCHGZETWjACROr@IZETWjAAJKd@On@ETGZOn@Mp@GR?@UjAENSr@Sl@KVQ^EFU^CDSVIFQPKHIFSPSJWJYJMDE@[Ba@D{@?[@G?wAAc@?G?K?c@AG?G?S?O?SA_@?C?C?_@?K?UH_A?o@@kB?oA@k@Dc@DcAFC?q@FU?_@@C?iB@_ADa@@KA[?Y?[CYCA?CA[GEAg@Ma@M]Q[QYQYUKIKKQQKMOOOQi@q@]i@a@k@MQOS]a@[YMKMK]SWOEC]KIESC[Gc@AWEY@Y@WFk@Hm@VUH[@o@HQDW?a@IQG_@Uk@a@w@g@MG[Sk@YYKSE[KUGi@GmA@WBI?E@KBkAb@qC`AsBv@aBn@cA\\\\k@T_@Ly@`@c@Re@VC@]PEBk@\\\\OHKFSNkAv@OHED_BjAIHiAdAcAz@_@ZIFYTYVMHKHEBIDA@MHi@TA@_@HKDUFE@aCb@E@gAPKBE?s@NC?_@JKBUFKDy@Xa@LKD{@Z{@Xi@Pe@RQHOFs@Zc@FO?I@]?i@Go@Kc@GiBEq@NuA`@SDOFa@Ne@NUFUDWBC?Y?E?U?YEQCEA{@YgAWe@EC?WAK@A?S@MBA?UDc@NIDa@NCB{@`@c@Pq@Va@HA?a@Fg@Bc@?aBAcA@qAD_ANa@Be@DI?}@Hi@D[Bk@F_@DaAHA?kBPSBM@c@DQ@Q@]BE?W?]CQAOCQEIA[K_@Qc@YYOCA]WA?QMMIMKSK_@SGCYKGAWIA?UEM?SAY?YBe@H[HYNA?k@`@QPYXsBbCg@h@WR_@VA@_@Rg@Pg@JYFa@DgADyAH{FGc@?g@AiACeBEi@AoCGA?_AEmAEgCIyAKaD[}P}BuOwBuEo@wFy@Q?Q?]B]B_@BeC^YDyB\\\\}B^OBYFUHWJg@TOJc@`@UVc@f@UXWZc@j@W^}@jAiAzA{@hAg@t@{@xAe@l@_AlA_AhAk@j@]Xi@\\\\GBcAd@]L_@F]F]B}@BaAG}@Oo@QEA[KoCaA]Ka@MgBm@o@QUGMCSCOCUEe@Aa@?a@BWBKB]Fe@JcAZw@XiBh@gIzBcA\\\\_A`@u@h@_@Ze@d@eAjAyBhC{ClD_CnCKLST_@^EFg@\\\\ULQJ[JYHE@m@Ju@@OI_@ESESEc@Ia@IWGMCc@IqAS[CMEYGWC_AMYC]AE?EBEBMAcAC{@Bg@Fg@J_@Jw@Zi@Za@XUPQPgAnAeA|AwApBIPKLOX}@fAONKJKL}@`AKHi@`@e@\\\\iClBMHUNYTMLI@IDIDMHGDKHUL]TUPaAr@QLu@l@CBiAx@cAr@w@l@YRw@j@g@^WRg@XUNSJSHUHOD]HE@QDQ@c@Dk@@g@Am@GMC{@SaBq@o@WUKKEuCmAeAc@yDeBkCeAkAm@WMKGa@[q@q@Ye@IOQWYe@i@w@iCwEc@{@}AmC_D_GU_@eBeDa@u@{@}Ay@}AaB{Ck@cAaAgBiAqB{@uBMa@IYQm@Mi@]gBEUG[OeAQcBGy@IyAEqAW}IImDMwCGgBE}BAmADaBHoAL{AJsANkBHiANgBLcBDgAJuA@_@Bu@Bi@?KByB?i@?u@@u@CuACkAEcAGsAQuAAMKkA[wBOiAk@iDO}@YcBi@wC[oAeD}Ro@cEEYQeAMy@eAwG]yBa@cCM}@YsAQu@G]cAqC_@}@m@iAUc@]g@QUy@_A_A}@uAw@o@[a@OMGu@Ug@M]Ek@Ga@AQCy@?g@@SBG?c@Dg@Hi@Lg@LIDc@Nc@Ta@T]RMJKFi@`@_@ZmAfAWTkAbAcBzAiAbAiB`BcAz@g@\\\\EBe@V[L]JGB_@Fc@De@BC?g@?g@A_@Ea@GYGECi@Om@WQGYMe@UOG{@a@u@Wc@Mi@GG?w@CO@e@Bg@H[HG@e@Pm@XUJa@PeAh@gBx@uB~@KDiAf@_Bn@C@a@No@NQBg@F[@[?s@?w@CeBCuBAsA?m@@]B]Dc@Hk@Pc@Re@Xg@^g@d@o@t@_@f@GFg@l@[^YVg@^c@Va@Pe@NA?[HG@UBy@Fa@?]A]Cu@G}AMKAi@I_@E_@EWAy@Ay@?w@@e@Bw@Hc@F_ARME{CbA_@L}Bn@KDkBh@a@JiAZC@}@TeAX{A`@o@NE@]HC@A?[JmAZ}@TE@]Ha@LE@{@RmBf@C@a@JwA^gCn@_EfA]JoA\\\\]HE@OFqA\\\\E@yAd@o@Te@Pa@PkBr@KDaBr@m@X[NID{C|AsAr@cCxAsAv@qGtDaB`AeEbCgFxCoC~AuAv@aCvAQJkDrB_Ah@}@d@gBz@u@\\\\YLcBl@WHaAXiAZODuBj@aAXoBh@sBj@qBj@wBj@G@yA`@SD_Dx@A@m@LaAR]FOBm@HaALo@FcAFE@sAFeAD}@Bq@BgAJYB]D_@DSDcARgATmBb@kBb@o@N_ARoBd@eAVmBb@aAVm@Lm@N_ATeAXSFeA\\\\gBr@mAh@u@^WNOHm@\\\\i@Zm@`@w@j@GDmA~@c@\\\\eCjB]XKFs@l@{@n@aBxAiB`BaC`Bs@f@kAv@IDUP_CdB{CzBi@`@{BbBkClB}@j@kB`AQHaA`@o@Rw@T_ARk@LK@cBRi@FaAJ_CVC?{@PSDq@F_ADsBTqDb@kHr@UDqBVc@BI@g@Bw@@c@?W?m@Eg@EkAOSC_B_@eAW}Aa@s@SaAWeAYm@OcAWUE{AYsAOA?m@EyAGi@A}CCgC@iA?iA@_BDsAFu@DC@kCVaALwB\\\\MBsAXE?wA\\\\}A`@uAb@_Cx@q@VSHyClAy@`@}DpB{BrAqAx@sA|@yAdAg@`@QNKJcAx@uAnAiAhAg@h@_AdAGHkAvAe@l@SVo@~@cAzAkBrC[d@ORQVuCfEk@|@EH_@j@qNrTmDrFcAxA{BpDkC~DmDrFuAtBaAzAcCvD{DbGkFhIgBrCkH~KoAnBiBpC}F~IqC~De@n@gBhCuArBy@pAkCzDiBxCgBrCmFhIkBrCiAdBCF_D|E_ArAqGzJyBfDcKxOyCxECBqC`EgBhCs@z@g@l@w@z@aAt@o@h@oAz@_@ReAj@cChAOHqAh@m@T}@\\\\E@aAZaAXk@Jk@Hm@Bo@AWCSCUA[Eg@Im@Io@Km@Ei@Ao@?k@F[DQDgA\\\\m@Xi@\\\\SNQNc@b@c@h@ORe@v@Yl@Qb@s@jBq@pB[|@oAvDa@rA_@rAg@zBOz@QdAGn@Ed@KdAEn@ErACp@CtAEnCEhAGjAKzAOjBWbDMxAe@tF]lEc@hFi@xGUzCGv@KfA[`EYlDSfCIt@OfA[|AU|@Yv@]z@[l@_@l@c@l@a@b@g@b@UNg@\\\\oAt@iBbAC@w@d@oAx@uAbAy@n@cCxBsKxJmBhBQNyCjCeExDy@v@s@|@w@fAwDtFuClEc@p@kErGsApBOPyE`H{ChEsBtCaAvAs@dA]f@qArB{C|EsC|EwBvD_L|R}AnCe@|@KReApBsAfCi@bAe@~@eC|E[l@m@lAgCdFgDpG}@bBGJiC`FWf@A?o@nAYd@Wf@i@~@iC`FoCpFwBhEQ\\\\KRm@hA_@j@_@b@_@`@GFYXC@g@\\\\YNa@PIDg@Nm@Lo@Hm@Dg@?}@Dc@DG@a@De@JG@YJGBe@R]POJGDWPa@^]\\\\UXW\\\\a@n@MRS^GNSd@Uh@e@xAm@jBWt@m@nB]dAcA~CcA~C_AzCw@`CwAnEwBxGi@~Ak@~Aa@lAe@zAc@rAm@lBu@|BY`AkAtDaAnCm@zAo@|AaDvHqCtGaCxFi@jAaA~BGNkAhCu@fBi@lAk@rAc@`Ae@fA_@t@U^Y^c@h@]^e@^g@`@]V[P_@Ri@Vo@T{@V]HUBu@Fa@BA@a@@aA?sA?[A{D?}A?uA@gD?sED_E?I?I@UJK?C@QAW?a@BKOA?O@oAAeF?U?iEEO?qCFaEE]J{DBO?O?EGECGAi@DO@SBi@D{@XSF]LSJUJe@ZUPKHSRQRQ`@MRKNINU\\\\EH[l@e@t@OVWTiCdGcBfDi@hAaAtB{@lB_@v@k@|Ac@bAe@fAe@|@kAhC_ArBm@tAWn@Q\\\\Q^Yl@KRQZS^U^Y`@[d@]b@c@f@OPg@f@]\\\\[Vc@\\\\GDk@`@g@\\\\y@j@aAp@aBhAcAr@a@Xq@d@{@l@]VUN]RWLWLSH[JG@IBWFe@H[Dm@F_@Di@Fg@Fk@LOD]Jk@Tm@XaAh@_@T{BlAmAn@m@\\\\w@d@iAh@{@b@OHcA`@m@TwA^o@Lk@Jq@Fi@D{ABm@Ai@C}AGsEUs@?QCg@CmAE_AAy@@{@@{@BeAFe@BsAJaALuATm@H_BRc@FcBRmC\\\\G@uEl@aBRqDd@uBXoBRcAH_@Bc@@]BaABo@@U?o@?mBAeAA}C?qDFaA?mBGeA?iC?i@@c@?y@@uB?kA?}@?m@Ak@?_BAC?cAAe@@_@A}C@oADk@@sDAc@?eA?cA?i@@kA@eA?aD?wD?oE?i@?uGByCAkAAoCAuBCO?qAAgAAk@Aq@Am@?O?]?kCAe@AoA?oAAoECuC?oA?iDBiNLg@@K@W?m@DW@c@DMBSBk@Ju@LWFa@JIBSFm@RQHm@T_@R[Lg@Xm@^c@XUPUP_@ZGDOLUTSPSPc@d@ONmAlAkAjAgAfAUTc@d@]\\\\WXURc@^SPa@X]Rg@TUHIBKDSDYFUBUBW@U@W?SAUCUAYEQEWGQGWKUIQKWOc@[UQSQQQe@g@u@}@u@}@m@s@Y_@s@}@iAuAgAuAs@{@y@{@u@u@OM][MKi@a@g@]g@[i@[i@Ye@SYMk@Si@Sm@Qk@Q}@Ys@SoCy@k@SWISIk@Ui@UWMg@Wi@YSMUOSK{@m@}@o@{@m@{@o@oA_A_EwC}EoD_CeBgBqAe@[SMUMQKWMSKSIYKk@QSEUGg@Kq@GUAWAk@Cm@A{CCA?}CAo@Ag@EWAWEUEQEYIKCGCUIUKUMQKUOSOSQUSQQw@w@iAiASSg@i@{AaBw@{@w@{@MKq@a@_@Qw@u@k@g@uAgA_Ao@mHcFeCiBmBwAo@c@qEaDcEeCcCwA[Qa@Qg@Um@Sk@Om@Oe@G[E[CA?QCQA[Ak@?k@@m@Bm@FcAN_@H]Jo@P]NoBz@_@NA@a@PaAb@o@XSJSJ}@f@QJWPg@^_@XYT]Z[Xe@d@e@f@{@bAq@`A_AtA}AbC_AzAuDbGkAhBYd@wDbGEFq@bAc@l@c@j@c@j@A?[`@[\\\\iArAgAhAcA`AWX}AzAw@x@c@d@_C~BONiEhEuGxGyAxAyAxAyAzAi@j@gDdDmDjDwCzCiCtCg@l@{@nA]b@SX_CrDSZuFtIk@|@c@r@e@v@u@tAg@fAYn@[v@]~@Sl@m@fBW`A[tAUbAOt@Mn@a@fCq@tEKt@{AzJQlAe@nCSfAQ`AWhAMj@w@|CY~@[~@u@|B[t@Wr@_AnB{@fB{@zAW`@k@|@u@dAs@~@eE~E_DlDcBlBe@h@g@j@]`@yJbLi@n@a@b@a@`@EDw@v@c@^WT{@p@e@\\\\g@^m@\\\\e@Zc@T]PiAf@o@Xe@Ny@Vw@TYF[Hk@Lk@Fm@JsAN_ADw@DgBDsDLi@Dm@FqATeAVoAb@aAf@WL]PuA`AMJ[VSPQPYX[\\\\c@f@oA|AgApAMNcGnHaFbGm@r@wAdBk@n@g@n@sEzFsG`ImCfDmCdDmCbDwCpDcQbTuAbBq@x@_AjAqBbCyHnJ{HlJmB~BcBtBcCxC{E`GaAfASVeB`BmA|@[Te@Xq@^y@^o@V_@LkAZi@LSDw@LsBZmAPG@c@FUDaFr@kC`@o@JqDj@y@LiDf@qBXaFt@oARk@Ji@LyA^y@Xs@Zw@\\\\w@`@g@Vo@`@kAx@g@^i@d@A@{@v@KJQPi@l@s@v@a@j@e@l@_@h@S\\\\[d@c@r@wApCeHnN]r@kArBaBlCuBfDoAnBa@p@_AxA}A~BcAxAuBbD_ClDaG~IsAtBwFzIuCpEeA~AcA|AaBzBKN]`@c@j@q@x@i@l@i@j@yBtBm@h@}@z@aFpEaCzBWTi@d@i@`@}@h@k@Vk@Ni@JUBW@U@i@@sB@m@@i@Bm@H_@HG@k@Pg@Tg@X[Te@b@_@^Y\\\\}G|IgAvAe@h@]X?@]Xc@Z[PUJc@Nk@Pk@Ly@NkCh@eAZm@Tg@Rk@Zi@Za@Vq@h@_@ZYX]^g@j@CB]d@q@|@eAfB_@n@qAxBsAzB_BnCi@~@s@jAgEfHu@pAoAtBkArBw@pAsAvBu@lA}AhC_@r@KPO\\\\Yn@M^CDMd@Uz@YlAOz@Mp@Ij@ObAYhBe@vCEZSlAc@pCOz@CLUrAOl@Mh@Sv@Yx@M^MZ[t@MX_@r@q@hAq@`Aw@dAaC~C[`@e@h@SVYd@KNs@`AQVGFuBpCeApAe@h@UTQNSPUPUNQLGDKFUJi@Vo@TiAVa@Fe@BaAHs@H{@NC?[FC@WDc@L[JOFKDUJC@a@Rg@\\\\k@b@GFYXi@j@e@j@_@l@_@l@[l@]x@iArCw@pBw@lB[t@c@fAm@bBg@zAg@|A_@lA{@jDuA|Gc@zBKd@eAhFu@pD]`B]~A_@dBk@nC{AlHG\\\\wB~JaAlE]~ASn@ITc@`BUr@_A|BWj@m@hA_@t@]j@]h@e@p@[b@o@t@WVg@f@YXCBmAbAs@l@_ClBgA`AyCdCc@^[RWPi@X?@i@Re@LUFUF_@Dk@BI?[@aAAiACeBEm@@{@Ba@Bg@FWDi@Ja@JMB{@Ve@R]Ng@VWNw@f@q@d@k@f@{@t@c@^gB|AgA|@EDsA~@e@Xi@XYJc@Ng@J{@Lk@Dq@Ba@?q@CaAKa@KWGiAYmA_@u@UsAe@kBg@gAU[EeAK[Cg@A{BBaCXoBf@[JoAl@{@b@i@Zy@l@}@t@o@l@cAhAeQxS{HfJeDzDwAdBGFeBrB_BjBu@~@g@j@w@`AONsDnEiAtAeD|Du@z@i@j@[Zs@h@g@ZA?u@Ze@Ng@JYDk@Bi@@[@yB@wDBoB?_A@mC?u@?w@BaA?kCBcDB}EFmB@sGBoC@{A?u@?CA{@Cq@EsAKWE_@GoFk@o@EwCY_BOq@Au@?u@Da@Ds@Ng@JE@YF]L_@Le@Te@V_Al@UP_@Xq@p@A@}AxAg@b@kAdAeAz@GDm@^i@VUJs@XeA\\\\kA\\\\yAh@_A^QHUJYHUFWFSBSDUBQ@UBo@HS@G@oBVUBk@Fu@JeAJg@FUB}@H}@NmANuEd@_AHK@_BJyBNU@aBJiDTwDTyDTwHd@w@D_DRA@oDRI@aDP}CTiAHeAFiAHyAJo@FeAHcAN_ANq@Nk@No@Lk@N}@Vq@RcA`@kBr@sAj@sBjAwBlAqAz@o@`@eQrL{GvEiEtC}AfA_ElCgAt@cHvEg@\\\\c@ZaAt@qAdAiAbAcB`BcAfA_AdAc@h@s@`AyApBkCjEYd@MRe@v@eAdBeAdBeBlC_AzA_DbEqM|Ou@|@{@hA[`@mDvEiA~AoEnGuCdEi@r@iCrDmAjBYb@IJgCnDaAnAgAvAWZaAhAKJa@^YZCB[Vc@\\\\g@^e@Xc@Te@Vg@V',
                },
                start_location: {
                  lat: 48.461322,
                  lng: -123.4030912,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '160 km',
                  value: 159632,
                },
                duration: {
                  text: '1 hour 35 mins',
                  value: 5700,
                },
                end_location: {
                  lat: 50.0307964,
                  lng: -125.2733941,
                },
                html_instructions:
                  'Merge onto <b>BC-19 N</b> via the ramp to <b>Parksville</b>/<wbr/><b>Campbell River</b>',
                maneuver: 'ramp-right',
                polyline: {
                  points:
                    '}yxjHl{hsVK?G?K@K@MBMB[HG@c@Hm@HWB]DE?c@DA?w@HK@c@DA?k@LUFC?KDUHUJYLWP]VUT]^CBSVGHKNOVOXS`@Sf@ITEPQl@GTGVG\\\\GXKt@CVCTCVCTAVC^A\\\\?v@?V?f@?L@p@BxD?f@AF?^BdD?t@@x@@hA?`@?T?r@?P@NBt@E`ACh@?@Ef@C`@CZGb@K|@Il@If@Kl@Ml@[rAUv@Un@ITGNWl@Wl@KPKRSZa@l@MPUXa@d@[Za@\\\\UPQL]PYPQHGBq@Z{JfEa@PgBx@s@^QJ[PcAn@[T]Vk@`@i@b@KHCDk@f@i@h@kAnAm@p@i@r@c@l@a@j@k@dAa@x@c@~@_@~@]`ACFa@lA]nAI^Mh@Ml@Mn@Oz@?BKr@OdAKdAKfAG~@G`AEhACx@An@A~@?dA@lAB~@Bx@D`AH`BJhBt@zLPlCH~ADhADpABx@?hA?|@Av@AXAZAp@E`AK~AM~AMjAIj@Ip@Mt@?@Op@Mn@WfASz@Up@CJIVITGPUn@Qd@Qb@U`@MZUd@Wb@g@v@EFSZSZW\\\\MNeB~Bc@h@GH]d@OVED[d@S\\\\Q\\\\]p@MV_@v@Wl@GN[~@Sh@[bAMf@WbA]vA]nAy@bDs@lCq@bC}@tCOd@Mb@]dAa@jAeB`FYt@ITM\\\\kAfDiA`D]~@}@fCg@vA_@fAWl@GNYl@]t@cAfBg@r@Y^m@p@ST_@`@o@h@u@h@]V]R]NQJg@Ts@T}@Te@JSDmAP_BF{A@mB?uBCkBGsAGg@CoCWo@IcAKE?mDg@c@Go@M}AWmBg@SG_Co@UGqEkAuA]aAUGAg@Ka@Gg@E[A]Ca@AS@w@@q@Bk@FcAPo@NaA\\\\eAd@k@ZuA`Am@j@o@h@}@fAEFi@v@_@l@q@lAAB{@pBGPIPaA|CABuFzQs@nBc@bA_@|@c@x@KPm@`AKNs@`A{@~@m@f@_Ax@e@\\\\KHeBhAOHYL]PcAZw@TaALg@Ha@B{F`@wAHm@F_F\\\\qBTG@{@LqATSD_ARq@PeAXGBoA`@g@NA@OFq@V{@\\\\{@`@]NC@gDbBiFhCa@RsDhBMFm@\\\\yBfAaAh@y@`@aAf@sAp@eB~@c@VEDm@b@YTa@\\\\_@^QNEDYZi@l@Y`@UXe@t@UZ[l@OX[l@MXWl@MZa@dAe@zA]jAABETYjAWpAa@hCm@vEi@lEG`@O`AUzAq@hECRY|A[bB]hBIb@i@jCGT]`B_@~AWfAgArEGNoAjEoBfGk@hBQj@]~@wBpGm@dBg@|AM`@cAjDg@fB[fAu@pCoB~HU|@k@hCg@zBu@rD[bB}BlLYxAq@nDA@Kn@CF_@tBg@`CYzAYtA_@~AW|@[lAQj@Sj@a@hAo@|Ak@lAo@nAQZGJWd@i@t@k@x@{@hAg@j@eAdAm@h@c@Zy@n@q@d@u@^e@Vs@XeBp@aA\\\\]LqAd@yAf@w@V{@^u@ZaAh@a@XUNa@\\\\a@\\\\a@`@WV]b@m@x@MPORu@tAm@jAUh@Uj@Wr@Uv@EJOj@Qn@UdAWtAWlAQfA[bBc@dC_@nBy@vEa@pBi@zBSn@Mb@Sj@M`@Qf@Q`@]t@Yj@[j@QZ[h@q@`Ai@r@WZ]^OLe@b@SRc@\\\\KHYRgAr@q@Zy@^s@XeAVg@J_BPkAJyE^{BN_CPO@c@D]D}BNmBLk@F{CRqBN[Bm@Fo@Fo@LSBs@Nw@Vk@Pe@REB[LCBk@Xq@d@_@TwAlA]\\\\ED]`@u@`A_ApAw@rAcB~CMRy@`BkAtBU`@[h@i@z@i@v@W\\\\WXUTQP[Ve@^g@\\\\e@TGB[Pi@Pa@LYFYFm@Hi@FI@U@c@?o@Am@?}AC{BAsDC_AA}AEO?wBEoDCq@?a@BQ@kALC@a@Hg@Le@Nk@Tw@XmCnAQHwAv@yAhAk@`@WTKJ_@^a@^y@~@WZi@t@{AvBuAnBoAhBeBfCu@fAmBnCMT}A|Bk@|@_A|A{BvDiBnDYt@]x@o@bBOd@MZ]jA[fAo@jCQt@WjAQbASpASxAO|AIt@I|@GfAG~@MxBI~CC~@OpGKzEKzEKxEOrGIpD?f@GlBGjBEr@Ch@APK`AObBMdA[|BCJU`BKh@Mp@Ml@s@|Ci@`Cs@tCGVOl@u@bDENsArFm@bCe@nBgCbKuApFkAxEsCpLeAfEo@pCQp@GX]|AMl@G^Ih@If@M`AG`@OrAGp@AFEl@AHEl@Ep@Er@Ev@Cx@APAf@EfB?HCzACv@?FCbBAnAAjAGzCEdACnAGjAMpBM|AS|BUrBkAbKi@hECRQzAQ~Aa@fEKtBEfAEjAAd@CdAAv@?v@?v@B~B@~@FxHLfMFhIFjFBzB?`BB|ANlMLjNDxDBdADvALhCBb@Fn@LlAJr@@BRtA`@tB^~ADPXfAdAzDj@tBZjAZjAXbAd@`BXvAPlAHv@Fv@Bn@Bf@@l@?Z?j@Ah@Cn@AZG~@CXIt@Ib@QbAOp@EREPCJm@nBmAbEMf@IVQr@S|@IZMp@Mv@OdAA@It@I|@Gn@En@E^i@xHS`DQjCGz@I`AGx@Eh@OxAIn@O~@QdAu@~DMv@SjAMt@G^E`@E`@?BE`@E^AXAVARAj@Ad@?L?l@?n@@T@`@B^Bn@ZnH@j@@p@?X@JAT?`@?t@AfAAp@MzEEnAIhCALEjBE|AIpEGpEGzCG`FAhAGjDCz@Cl@Af@Gz@ALCZEd@Kr@]tBm@`Du@xDc@`C[dB]bBe@hCS~@a@vBqAxGa@|BUxAUzAGb@]vBKp@YfBAD[fBSbAUhAABa@dB_@xAUt@St@Wz@s@vBe@pAk@vAc@fAi@lAi@rA_AxBUf@eAbCw@jBc@dAGL[t@GLSh@Yt@Ob@ADK\\\\Qn@I\\\\Kf@QfAIf@Ix@Gh@MzAMtAInAKpAOxBCVSfCStBIr@I`@ADG\\\\I\\\\M`@O`@Wn@INGNQTEJCDGFS\\\\ST_@d@GF}@dAa@f@[b@QVKRININKRITIVSp@ELS`AMdAIt@ALAd@AZ?L?j@AvC?jB?l@?TAdAAr@Al@Cv@CZCf@C`@C`@CZIv@OtASbBUlBGf@Gd@AH_@bDEXUrBANMjAIf@G~@Gr@Ej@G|@Cf@ElAGdBCpAEfBA^CxBE~ACt@?@GjBI`BGjAEp@Eh@GdAI|@I`AGx@SjBIn@OjAM`AQpAQdAMt@EVMr@AFUfAQ|@Qx@?@YnA]|A_@dBS`AQx@UbAGX?@Qr@SbAWlAKf@a@jB?@EP[tAKj@A?s@jDg@zBc@rB]~Ag@tBw@zC_@pA]jAQf@a@pAWr@[z@Yt@[x@i@pAu@dBk@lAy@|Aa@v@i@`AYf@[f@i@|@aAxACB_@h@QT_@j@a@j@SXq@`AmAfBw@fAYb@SZi@v@q@bAm@|@OTa@j@cAxAKPgA~Au@bAu@dAaAtA_@h@e@p@QVc@n@_B`Cg@r@uCdEeBdCMPQX}@rAYd@[d@iAbBa@j@Yd@[b@gA|Ac@n@m@z@s@`Ag@r@MRq@t@e@d@]Z[Rk@`@ULSJ[Lc@Ng@NC@_APaAReC`@e@Ho@L[Hc@J]LYJMFSHQJOH[PCBOHg@\\\\URc@`@QPa@b@STa@h@s@bAeAxAoBnCi@r@a@h@UVg@h@k@f@WT[TSLED}@f@]RGBi@VWJg@PWFYHe@HWDUBQB[B]BW?]@I?}@Ai@CeAE[CK?y@CmBEi@?W?q@?i@BeADu@Dy@Fo@HE@m@F_ALgARa@J[HcAXu@RgAZw@VUJUHi@Xi@\\\\g@^e@`@s@r@WZMPORm@`A]n@_@t@Sf@Yr@Up@CDK\\\\Wx@]lAIX]`BGTMj@Kf@UvAOlAKhAGp@K~AKlB?PCn@AvAA\\\\?d@@rA@hA@X@n@DbAFz@FdALtA@LLbAD\\\\BLV~ATnANl@ZrAh@rBd@hBLf@l@bCBJr@pCLd@l@~Bv@lCX|@HVDXF`@Hb@VbAbAzDZnAT~@j@hCTrAHd@?@Hp@BLJ~@Db@Fp@Dl@?BBb@H`BDdA@d@@`A?hAAz@?n@Ct@Af@APA`@En@Ep@IbAWfCKhAi@nFu@pHqQbjBsB|S}AdPOxAQpBABGr@e@rE_@vD{AxOIbAc@lFa@vF_@xGIlA_BxYIpAGpAe@bISxD[rFYfFCl@IzA[nEKhAGf@It@MdAU~AW|ASfAWhAYnA_@vA_@pA[`As@rBmAtCcCbG]x@_@x@cCdGUh@IRmAxCc@dAs@hBUh@Uj@{@|BWt@IT]dAOh@e@dB]tAYvAWpAMv@Kp@UxAOrAS~Am@bGUtBm@|FcAtJYnCAL]vCSnBCVQ`BOzACLa@|DsCtXq@vGm@pGa@~EOdBMjBKlAM~BIbAOdC[pFIhAMbCEbAInBIpAIxBEx@EpAGbBCx@Ct@GfBA\\\\Cj@GnBWjIY~HE~AGpBE~AOnEKdC?NCf@AX]zKCt@IxBOnESpGCt@APMpDOpFSzECv@KnCKfDA`@QtFC`ACv@?ZIxAGbB?PEzAA\\\\WvGOjDKfBWfDIx@K`AYfCQrAStAYhBY`Bc@vBe@xB_@|Aa@|A{@tCo@rBs@pBeAnCSd@o@bB]z@_@bA]h@gA|Bc@lAg@pAQj@Qp@Qr@Sl@Wp@Sd@[z@c@nAOb@EHUv@e@`BMb@Qp@a@`BMl@On@a@~BYbBOhAYpBMpASpBSzBI`BG`ACj@AHIxBEnBC|BAlC@VAhAB|BFrCHjCHjCNlDFdBF~APrEj@xNTfHz@hT@ZRtFVbHFnA?BDvAb@bL?P\\\\`JXzHZlIjAt[^hKHxBNjDdA~X^jKNjEFdBDbB@R?b@BdA@tDAlA?p@CpBEvBEdBGtAIhBKdBMhBMbBUbCOlAS`BKp@Il@OdAO`AY|AWvAUfA[tA_@`Bk@rB]rAQd@[bAq@lBcAnCeDnIi@vA{A|D{AzD]z@sDpJ_AdCw@xBEJQl@ITc@|Ac@|Aa@bBYpA]bBWvAYfB]bCS~AO~AIr@MvAKxAMxBAXCb@AVCd@E`AEpAAh@EvC?x@?P?L?XB`K?V?^B~FFvKFjO@nABdE@V@bD?v@@zE?h@?LEbMKvJAbAMhIE`BAt@ElB?RUzGMvDW~Fg@rKk@vJGz@Gt@Et@k@bIANEd@QtBWtCq@`I?@Ir@cAdKQ|AUrB]dCSnAIr@]fBaAxHMx@CVM~@o@`EaAdGy@hEm@xCy@|DkBjJkAjFeAhEg@|BSx@w@vCq@jCo@bCQn@k@vBsAtEo@tB[bASn@wAzEcBtFs@~B{@jCyCnHOf@Qf@wAlDq@dBO\\\\yAjDUh@eA~Bm@tA_CrFgArBw@zAqAtBWh@q@lAs@vAo@hAWf@sBnDwDjHYd@Ub@oCbF}EzIeExHq@lAMTYl@{AxCe@z@gAtBuBtDaAjBmA`C{@bBw@`BGNi@fAi@nAeC|FABsB~EsAfDaBlEmAdDoB~FqA`E}AbFABQj@c@|AWz@iBrG}AnF}AxFK\\\\cE~NsDlM[fAy@vCe@|Ae@|As@bCEHs@vBi@bBSl@KZSl@Up@e@pA{@`Cu@rBy@pB?@_A`CcBbE{ArDkBxE_B|DcGbOa@z@Q\\\\Qb@i@xASf@{@tBEL}DtJWp@g@tAy@jBOXo@xAi@fAs@xAABa@p@m@fAg@z@EFmAfBaArA_AjAEDm@r@q@r@g@f@QN]\\\\QNeA~@aAv@aAr@OJ{@l@A?_@Tq@b@MJ_@Ta@V_@VyA`Ag@Z_An@_@Va@V_Al@aBfAw@d@wE|CkAr@qA`A_@VEDSPURq@f@y@bAw@z@Y^WVi@t@a@d@SVUb@Yb@CDq@|@]`@_@h@?@aAlBS\\\\KVABi@hAUh@Un@A@Qj@g@~ASn@_@z@}@fBS`@S`@oBjDAB{@zAEFkApBGLAB{@hBSf@Sb@OZo@lA{@fBSb@O\\\\MZqArC_@~@Yl@i@lAo@xAe@~@INWh@k@tA]t@{@fBOb@y@|AsBdEcAxBiBzDs@|AMVUh@Ub@w@bB_ArBc@hAO^KVIRMXi@~As@xBK\\\\I\\\\Sn@Op@aAtDi@`CqAzGMp@Mp@EPg@hC_B~IUjA{BnLcCjMk@~Cs@fD{@rEQ`AaAhEo@rD_BxIgBvJs@dD{@xDi@dCGTu@bD}@hDEPK`@]lAGPw@fCc@|AmAvDGPKXO`@cBjFIVO`@ELaAvCs@fBi@vAGLM\\\\GNgBhESj@A?gClFmC`Gs@rAIPm@`Bq@fB_@p@k@hAYh@kBrCGHS\\\\MPU^UZOR{ArCQ\\\\]r@S\\\\GJqAhCYh@iA|Bu@xAIL_@r@oA`CkArBqA|BaBnC_@n@_AzAcAzAiA|AeDtEu@bA_AzAc@r@a@t@o@nA}@`Ba@z@kBtE}@dCq@xBm@tBk@|Bq@zCMn@WrA_@|Bc@|CYbCCROpASbCAFEl@OxB]zFEr@Cl@c@rHS|D_@zH[|FCd@Ex@KjAU|CYnDCRIp@It@Ed@UhBYxBWbBGd@ObAQx@Y|AWtACPs@nDGTMn@i@vBYbAQr@m@|Bm@hBOb@g@zAk@dB[n@Ud@u@lBm@`BSj@uB|FwAbE}@bCu@lBqAlDeA`Cc@fAk@zAs@jBwAlDUn@kA|C_BrEw@hBO\\\\GPs@nBADeAdCOZWj@Uh@]v@eBzDeAxBCF{BlECF{@`B]p@aApBqAjCINOXGNuAbCa@z@i@jAiDpGoD~Gk@fAQZoAfCGLgBfD{@jBk@hA]p@a@r@s@dAiAtBw@~AaBfDg@`AYb@Uf@m@lB]`AWl@m@lA_@x@A@S`@_@j@m@v@eAxAi@dAk@lAEDu@zAgBhDmAbCGJq@jAABWd@g@bAy@~Au@tAOZGNQn@M\\\\MVg@~@qArBcApBk@dA_@t@i@dAmAzBc@t@wAjCsAzBy@pAg@x@c@n@e@p@[d@sAnBcAzAa@d@KNW\\\\[`@i@p@UXa@j@U\\\\g@p@c@j@WVQNWTQRk@d@GJk@h@{@z@YZ]^a@b@iApAc@h@_ApAg@p@k@z@MRYl@_@t@KR_AfBOX_@p@Uf@Wn@Q`@_@|@Ob@Wx@Ux@[fAMd@a@dBQz@Mn@SdAIf@Il@Kr@K`AKdAQbC_@|EQjCCl@S~D?FWjDI`AMzAMtAO|AEZG^CTGb@QtASfAOt@CJYrAELWhAWbASr@YbASn@ENWv@Od@u@pBe@lA_@x@?@k@hAi@fAYf@cAbBk@|@[b@CBGJ_@h@MPe@l@u@z@a@d@WVYXKJONEDONIH[VWTc@\\\\a@ZQLa@XYRYPUNc@RmAp@WL_@RE@q@VkBz@uAl@{@\\\\e@Po@XQHEBsAh@WLUHs@ZsAf@gAb@aA\\\\?@mCfA}F`CMD?@gC`ASHqAj@A?cBt@s@XiDtAmAh@wAj@i@Rg@Tk@XkBv@{@`@_@PKD{B~@mEfB[LuAj@eAb@s@Z{@XIDuAh@u@Z{An@SJa@RWN{@b@g@Z_BdA{@n@q@j@e@`@aA~@a@b@Y\\\\aArAGH_AxA_@p@MTKPYl@g@`AcAfC_@lAa@xAs@fBe@vACH]tACJ[xA]xA[xBKt@CRE^Gp@OxAMpAEd@ShC_@|EMlBS`COnBQxBI~@KtAm@`IGt@]xEIdAK|AGt@OvAYtCYrB[dBm@jCWbAUt@U`AiAjDi@bBc@hAm@vAc@z@w@tAm@bAi@t@e@p@{@fAk@n@a@b@SNON}@x@g@`@g@^{@j@u@b@eAh@i@Vm@Te@Ni@Ni@NaATaATu@N{Cp@SDiAR_@DOBqARaAPoBh@uA`@wAh@oAd@k@VQJ_Ad@?@a@TYP{@h@g@^e@^i@`@e@`@e@`@s@n@{@~@[^MLOPIJA@y@dAIJ_@h@MNUZmHpKq@`Ay@bAa@f@OPA@eAhAy@|@aBxAsB|AsBrAaAl@i@Vk@Xe@Ti@Tk@Pe@Pi@Rm@No@Ro@Ny@PODA?wAb@aCr@yBdAMDgAZ]Hk@LiAXMBaCd@m@Du@DmAH_AFyA\\\\u@RWHE@YHIBs@V{@^_Ab@YNMHUN{@h@A@m@`@IFOLi@b@s@p@q@r@CBYZ]^IJaAnAA@KJGLKJQTCBEDMPaHpI}PhTi@r@k@r@cGvH{C~D{GpIw@bAo@x@kBfC{DtEUXiC`DiAtA}@~@MLu@r@}ApA{@n@w@h@o@b@EBGDWN_@TYPcBdASLq@`@yA|@mC`BYRC@wAz@aBdAgBdAcBdAa@Va@V]RaAp@a@X]VyAbAeAx@uAfAwCfCKJs@n@aA~@yAzAa@b@cChCkBpBqCvC_CdCmBrBsAtA_A`AoCtCgEnE}BbCmBnBaDfDo@p@_BfBST}B|By@z@_CdCaHlHyB|B]^iFrFYZGF]\\\\gIrIWZCByA|Ay@`A[^A?[^}@fAcAnAcArAOPKPg@n@OT[b@CDs@`Au@fAKNg@x@[b@?@m@~@EH{@tAuAfCo@fAS`@eAlBeBjDeBnDyA|CgAjC_A~B{A~Du@pBA@iAhDc@pAo@rBWv@a@rAIT_BlFc@zA{@rCo@vBSl@a@xAgBzFy@pCwBjHEL_BhF]jAs@xBa@nAKXiAhDc@nAsBdGEJSl@}@fC}@fCqCzHkAbDWp@Sl@MZ[z@IRM\\\\Uh@y@zBcAlCiBhFkBbFaAnCuA|DsAxDcA|CyBlHs@|Bo@tBa@pA{@xCOf@uA~EeAvDi@zBy@|C{@bDmCzKm@~BaI|[yCxLoB`IiBnHk@xBaCnJaBtG_BxGq@tCs@pC]rAGTGXQp@_@`BeAlEa@|As@lCc@|A{@~CWz@GRi@jBo@vBSr@g@`BsArE{AbFsEpOgGtSCFCLq@rBm@`BUj@i@xACHIPGNe@dAw@bBsAlC_BrC}@vAs@dAaB|BeAvAi@n@e@f@y@v@m@Zk@d@k@f@sAbBKJqAdA}@r@gAt@aAp@u@b@o@^u@`@E@{@f@YN[N_@PWJy@Zg@P]J_@LgBd@u@P}@TkAXaCl@iCh@{@P{D|@aGpAWFaGvAQFODSDODOFA?uAb@sAb@sAd@mAh@e@Tm@\\\\}BnAgD~BeBrAmAbAs@j@o@n@u@p@mApAk@l@EDaAfAaBlB{AfB]b@mAvAe@f@y@`AsB`CgAtAaCnC_@`@}CrDcAjAmGrHaCpCKLyAfB}BtCcAjAaAfAo@t@kArAm@p@y@v@s@r@c@f@IHGFqAfAqAhAsAbAmA~@EB}@n@iBfA{@f@UPcAn@_@R]N{@Zw@\\\\k@RUFaA^m@XcA\\\\k@Rk@NkA\\\\cATYH_ARYFg@NiALaANWDm@HeANo@HeAHs@L[BeCToCVqBTq@Hm@Hi@HUDq@LQBUDi@JKBgBh@_Ab@w@d@iBx@sAn@WHUL{@h@gAt@YT_@Ze@`@qAnA_@\\\\_BdBe@l@y@rAe@p@U^MTk@`Ac@`A]r@INWh@CDUj@O`@cAlCe@pAUp@Sl@sBdGELSl@Sl@sBbGuCrIeE|LgCtHsE~Mi@|Ao@lBw@|Bq@pBg@xAYz@Yx@u@pBYr@Sh@A@s@~Aa@|@m@pA_@p@[l@a@t@]l@c@r@Yb@Yd@A@[f@UZq@~@a@h@_@f@[`@kAtAg@f@IJSRgA`AeBtAoAfAsA`A}@p@mD|BkAr@gAv@sCpB}@r@m@j@_@^c@`@GFmBdBWV{@dAuCxDaBzBeBjCoCdEEHsApBwJjOkAhBmAlByAzBeDfFQVYd@mAjBABwCvE}@rAu@hAoAnBYb@kBrCgKzOmC~DiAbBUZUZsDdFeCfDq@x@kB~BmF~GaB~BmDzEwAnBGHSV{AnB_CxC_AjAk@v@{AhBaBrBcDdEeArAcH|Ik@v@cDdE}@lAmA`BcCvCmAzAwE~FwDvEOPc@\\\\GFGHMPWb@a@n@gA~A]h@m@x@_ArAuA`Bw@|@c@f@g@j@UZ_@f@SRe@`@mAnAu@v@y@x@wArAgA~@a@`@qB`BaAx@gHlGcDnCOLiDzC_@ZwCjCMJURyC`CoB~A{@r@_@ZWTOJiAz@}BvAk@ZqAt@wB|@_C~@{Ad@{Ct@aBT{ANo@FeAFiABM@iA@iAA_AA}@?_@?_BAqBCm@AmACqBEm@?yAIq@Gi@C_@?m@@y@@kALcAHcAJeANSDA?a@HA?I@i@LOBw@RMDw@RuAd@aA^aAd@oAl@yAx@k@\\\\SLk@^{@n@k@`@k@f@MJ{@v@g@d@y@z@qB|BY\\\\iBtBuCfDGFwB~BcBjBqEfF}@`AaAz@iFfGcBpByEvFi@n@}EtFA@_AfA{CjDcAnAg@j@gApAg@j@cCpCqAxAKLy@`AQRi@j@UTq@z@STkAvAIJm@n@gAnAy@`AwA~AaAjA_BdB}AxAi@h@a@\\\\}@z@mAbAKJo@f@}@r@g@^}@p@}@n@m@`@OJ}@j@_Aj@?@_@TGD_Al@qAv@kAt@{A`A_An@cAl@iAn@_@Vo@`@m@Zi@\\\\_@VWRONOLKLGFKBi@V_@P_@R}@h@_BbAcCzAA?]T_@VcDrB_@Ta@VMJQJaAl@_@TaBfAaAl@_@TOJq@b@_Al@eAn@sAx@k@\\\\_@VKDwA|@sChBuInFYPwBtAwDbCmCdBsD~BcAp@aAn@MFe@ZOJ_B~@_@VaAj@}@j@eAj@UNKFaBfA_@Vw@f@GFKFuA|@cC|A_@V_@T_@RaAl@c@Xi@VUJUPk@`@w@f@CBe@Za@T_@V[PCBc@Vq@f@a@Tc@Ve@Z_@ReBhAa@Ta@TwAt@iAf@cBr@a@Li@Ps@Rs@RmAVu@P{B\\\\e@Fa@F_@DaABq@DeBNaCRe@Bi@DeBJwCT_AFYD{CV]DO@_@BcBHi@Dc@Ds@FeAJ}@DWBkAHS@K@]BO@WDs@DcAFgAHwAJaAFeAJe@Fi@Fa@DWDi@FOBQB[JUJc@Nw@XaA^y@\\\\m@VID]N_@Tu@d@gAt@IFkAv@[Vs@n@SPKJKJmAhAi@n@[^wDbF_A~AYf@CBuAlCcAtBu@vAgBtDe@|@i@bAcAnBe@~@GLS^gEjImClFo@rAiAxByArCi@hAw@vAaA`Bs@jAwBlDy@hAy@hAKPcC|CiCtC}BbCuAxAa@`@qApAwCdDyD`EeEfEe@d@q@t@kApA_CbCeBjB{A~A{C|CcAbAk@l@{BbC}E`FcCdC]`@eAdAeBfByAzAkArA_CpCoFbHs@z@s@dAkBpC}@nA_@d@EHe@|@U`@mBrCCDwBbDo@~@o@~@k@p@MReA|Ae@j@]f@UXa@h@a@h@}@jAo@p@i@h@aA~@}@v@_@ZKH}@t@e@`@_Ap@]ZCBo@`@k@\\\\k@\\\\mDpBc@Rg@Tc@X_BbAg@ZqEhCqCdBa@RWPmDlBaB~@kBfAqBfA{@f@a@Zs@h@eAt@kB|@s@d@mBlAoAz@k@d@k@`@{ApAaAx@eBfBaBpBa@f@mBhCiAfBMPaA|AaDbG}AdDgAnC{@xBq@pBeAdDSn@Sv@c@zAk@bC_@`BQ|@Or@i@|CAB[nBq@hEq@~Dk@jDGXo@fESjAg@|Ce@rC_@lBOt@On@CNk@`DA@m@pCGVOp@CDYlA{@|Ce@`BQl@IVK`@Wx@q@pBGP[dAKXQh@O\\\\IR{@bCSf@Uh@]x@m@pAk@jAc@~@q@rAMTOVKRQ`@]p@]n@?@_@n@aB|Ce@|@Yd@INc@z@_@t@]p@]p@Yd@SZCDsA~Bk@jAy@rAOVMRq@pAiAnBYj@m@hAMNs@pAABkAvB}@~Aa@t@aAfBYd@QZOVEJu@hA_@v@q@nAm@dA_@j@Q\\\\u@vAi@`AiAnBu@rAIPkAnBwAbCq@jAi@dAQZiArBo@hAWd@MTs@rA?@s@nAaBtCcArBQXOPmAxBiB`DYf@Q\\\\_@n@m@fAq@jA]l@U`@Yj@m@hAWd@[`@[j@GH{AlCs@pAm@fAeAnBYh@i@z@i@bAEF[d@Yf@y@rAcA~AGHs@dAMPU\\\\GH[d@SXiBfCKLm@v@y@fAq@z@yBnCS\\\\iArAa@j@mAvA{@`A[\\\\}AdBy@x@m@n@gAjA}AzAoAnA}@|@e@`@qAhAqAjAcBrAo@h@gAz@w@l@kAl@YPa@`@c@d@_DnCqAfAwBjBoAdAk@h@kAhA{@x@OPg@d@q@p@YVq@n@q@v@Y^m@v@_BfBA@gB~Bc@j@a@d@i@f@qA`Ai@j@}@bA_@\\\\e@j@]`@aA`AiAhAi@f@c@\\\\WRw@t@i@b@u@p@a@\\\\e@\\\\]XsCrBs@b@YRo@^YNw@d@eAr@]HQBUDc@NuBbBc@Vs@f@c@Rm@Tc@Ts@ZoAn@aAb@y@^]JQHQJ}@V]HUDi@Fs@PqAZo@Ru@^kAh@s@NyEbAUFkEz@WBY@aGt@y@HQ@u@FuBNaABmDLmABc@@M?sBBeDA}@CYA}@Cc@AkAEeCMmAIa@EoAMcBSkAMcBWm@IYGeAS{@OeCe@}DcAqCo@aA[gA]YKGCA?sBw@q@WWKQI]Oc@Ok@UaAa@aA]_Ac@AA{FyCKE_GmD}B}AaAo@_@W{CsBECIGUOaBgAaCaBSMk@a@aBgA{B}AgEqCa@WQMo@_@{@i@sCmBsCoB_Aq@u@i@mEwC_@Ws@e@oEwCaAm@_@UECuCoBsA_AsCqBqA}@qJkG_@Wa@WaC}AaAo@eDyB[U_@WSO{B{AQK_@Wa@WcBiAwAaAg@Y_@WA?_@UIGgAw@qA{@{@m@cDyB_@W_@WCA}AeAs@a@gDqBmBcA_Aa@mCeAw@Yo@UcAYe@MWIIAoDu@UEoAQkAOgAK[Ce@EiBKeBEK?c@?s@AU?}@?i@@a@@G?mAF{@Hc@@iALsANsBZsB`@{Cx@uAf@kBp@A?aA`@}@`@gEpBkDjBaDbBkB`A_DhBgDjB_HzD_DlBuAp@{DrBkDlBaDpBe@VcFpCwBnAgJhF_Ah@iAn@gAl@}@f@aAj@_Ah@oBhAqAt@g@X[PgAl@iH~D?@_@RA?qJpFkDnByL~Ga@TcB`A_@TcCtAa@T_@TyAv@IFGBYPaAj@a@T_@RoGlD}@b@_@VA@eDlB_@RA@cE`CA?a@ReE~BgFvC_@Ra@T_FpCiH`EaDfBgBbAkN`IyDvBA?k@ZSLeB|@YNGDA?}Av@iBz@a@P}Ap@kAf@A?_Bn@g@P[LEBC@{Af@mA^IDaAXuAb@mD`AwA\\\\yAZsBb@QBq@LQDmBZoBZgANo@JWBu@JwANc@Dc@DE?]BiAJiBLw@FM?aDLyABc@@C@wBD}@?eB@}@?eDAqBIwEGsAC{@A_HKg@GeDK{@C_ACiHQwGOwAEw@C{BESAmCGQAu@AyAEyACg@CoDK{Oc@OAu@Ie@Gg@Kw@Uw@Ws@]QM]S[UWS[Yg@g@EE[a@MOi@w@W_@[q@Wq@Qc@Sm@?AQo@AIG[GYIe@?EIo@K_AGk@?CAGCi@?AEu@C]GmBAYC[IaAKeAOw@I]KWUo@Q[OYCEa@i@u@m@kBgAmAEyAE',
                },
                start_location: {
                  lat: 49.1204744,
                  lng: -123.9136726,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '1.7 km',
                  value: 1715,
                },
                duration: {
                  text: '3 mins',
                  value: 164,
                },
                end_location: {
                  lat: 50.0304744,
                  lng: -125.2494174,
                },
                html_instructions: 'Turn <b>right</b> onto <b>16 Ave</b>',
                maneuver: 'turn-right',
                polyline: {
                  points:
                    'osjpHtmr{V@uE?q@?uB?W?eB?M?eF@gA@aD@sI?oB?sBByA@_AD_AJgDXmD@S@i@?m@?[?w@@wG?gL@wG?[?_G?uBK{KAqIDeDFyD',
                },
                start_location: {
                  lat: 50.0307964,
                  lng: -125.2733941,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '0.3 km',
                  value: 271,
                },
                duration: {
                  text: '1 min',
                  value: 41,
                },
                end_location: {
                  lat: 50.0280395,
                  lng: -125.2494434,
                },
                html_instructions: 'Turn <b>right</b> onto <b>Dogwood St</b>',
                maneuver: 'turn-right',
                polyline: {
                  points: 'mqjpHzwm{VnF?x@?zDB',
                },
                start_location: {
                  lat: 50.0304744,
                  lng: -125.2494174,
                },
                travel_mode: 'DRIVING',
              },
              {
                distance: {
                  text: '0.1 km',
                  value: 139,
                },
                duration: {
                  text: '1 min',
                  value: 33,
                },
                end_location: {
                  lat: 50.0278962,
                  lng: -125.2475232,
                },

                polyline: {
                  points: 'gbjpH~wm{VH}@PkB?uE',
                },
                start_location: {
                  lat: 50.0280395,
                  lng: -125.2494434,
                },
                travel_mode: 'DRIVING',
              },
            ],
            traffic_speed_entry: [],
            via_waypoint: [],
          },
        ],
        overview_polyline: {
          points:
            '{lyfHbz}oV`BnJpBqFpDv@@jLcRtMzIpoAvKvuAv[zc@J|[mPzh@_B`_AjGtbBhFznDeTfn@`@j^|k@biAtUnoAhDdc@aLnp@~Gpw@_l@|`ByI~a@kSlFoa@BiV}MuNeC{Y`HsXpQw{@`Lcd@xCeRkCoZnIymAsLoUlFoUtYsi@_@gd@r\\\\kNg@cNC{QbSg_@vWqOqAm_@oZ_\\\\io@uCst@rBkb@sMa`AeMqg@iS{Guf@zW{OiEkVhJ{g@nNuq@hHun@jQ{|Azu@m{@hOuz@zd@ed@bVaf@fFkaAiFej@hTyY~[k}BvmDww@vjAwZfLeRp@{O~`@{PpjBm_BzfB_sAxcC{ZbOuj@~~A_]`v@kObGujARg\\\\h`@wc@|p@ah@fUyqCfMkwAEq~@jHq[jT}a@c^sz@se@}`@{FsdAwt@oa@dMugApsAqk@vs@wOlp@kPxh@ug@nl@et@rRuyB~kCi`@nZqp@~JgVlOkc@vu@}m@z}@c^nVkr@n_@wp@vfAeY|y@_`@jT_h@`~A{Q|j@}WpT{k@bRmV?eb@fDk_AdhAk[tG_tAe@ig@`W}zAdL_a@~J}hAlw@qxAzpBwWdJyK~UcB`p@}f@d`@_Wrr@I`mAey@`tBoRjK_j@yDgZ{EeWzSkUzi@ic@tJq~@h_@gY~{@yk@l}BeLxe@aSrUuYbNuKbWy[xv@u}@~M_d@xf@cc@MwVhL_n@trA}N~lBa\\\\nbBaIbfB~ObcCuInp@uKxtCgq@`~CeNr[_Fhx@u\\\\`aCurAfuBkcApf@qk@bOmI`w@xU~eAy\\\\voEe\\\\lfD}b@vkBk[feGy\\\\dbBwN~jAjS~vF_Cvo@mQ|o@u\\\\z}AcDnnDua@zqCey@~uBmjApgCi_AbrCcj@p_Ain@je@_dApwBcn@zyCcg@bsAiq@niAoS|u@mGvdA{]~sAsm@|wAa_B|zC}a@fi@oR|jAeUbp@q`@fW}dAzb@kk@ng@cRr_BcSxi@kU|Mqo@|Xwt@dm@ko@`TquAxcBmx@jj@}gBllB}l@pfAwr@nxBi_ChkImq@vs@cnA~c@igAloAmu@x[}ZtDg\\\\jTet@npBe}Bj{CkpDpmEcf@h[gd@bBkq@~MagCzkCuvBhsAih@f\\\\w_AvNci@vI{y@nrAaxCrmDkhAfr@wa@pu@cOzy@gWf{@g_@dr@csAj`CgmB|oBcp@~a@shAxMy}@cRevAs}@_iAqu@uy@gSip@hSokArp@uwAtx@}|Atz@_y@vPaeBiBqd@oH}FmOmBqSmIqGwAuV|@ix@Ee~@lNuDZ_K',
        },
        summary: 'Trans-Canada Hwy/BC-1 N and BC-19 N',
        warnings: [],
        waypoint_order: [],
      },
    ],
    status: 'OK',
  };
}
