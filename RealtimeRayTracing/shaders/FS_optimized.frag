#version 120
struct Ray {
  vec3 origin;
  vec3 dir;
};
struct Material {
  vec3 amb;
  vec3 dif;
  vec3 spec;
  float pow;
  bool refractive;
  bool reflective;
  vec3 f0;
  float n;
};
struct Stack {
  Ray ray;
  vec3 coeff;
  int depth;
};
varying vec3 vsRay;
uniform vec3 eye;
uniform sampler2D sunTexture;
uniform sampler2D earthTexture;
uniform sampler2D earthNormalMap;
uniform sampler2D moonTexture;
uniform sampler2D moonNormalMap;
uniform sampler2D groundTexture;
uniform sampler2D skyboxTextureBack;
uniform sampler2D skyboxTextureDown;
uniform sampler2D skyboxTextureFront;
uniform sampler2D skyboxTextureLeft;
uniform sampler2D skyboxTextureRight;
uniform sampler2D skyboxTextureUp;
uniform vec4 spheres[10];
uniform float time;
uniform int depth;
uniform bool isShadowOn;
uniform bool useNormalMap;
uniform bool isGlowOn;
uniform int colorModeInTernary[3];
void main ()
{
  Ray ray_1;
  ray_1.origin = eye;
  ray_1.dir = normalize(vsRay);
  bool continueLoop_2;
  vec3 coeff_3;
  int bounceCount_4;
  int stackSize_5;
  Stack stack_6[8];
  float v_7;
  float u_8;
  int tmpvar_9;
  float tmpvar_10;
  vec3 tmpvar_11;
  vec3 tmpvar_12;
  vec3 tmpvar_13;
  vec3 color_14;
  color_14 = vec3(0.0, 0.0, 0.0);
  stackSize_5 = 0;
  bounceCount_4 = 1;
  coeff_3 = vec3(1.0, 1.0, 1.0);
  continueLoop_2 = bool(1);
  while (true) {
    if (!(continueLoop_2)) {
      break;
    };
    vec3 tmpvar_15;
    vec3 tmpvar_16;
    tmpvar_15 = ray_1.origin;
    tmpvar_16 = ray_1.dir;
    int tmpvar_17;
    float tmpvar_18;
    vec3 tmpvar_19;
    vec3 tmpvar_20;
    vec3 tmpvar_21;
    tmpvar_17 = tmpvar_9;
    tmpvar_18 = tmpvar_10;
    tmpvar_19 = tmpvar_11;
    tmpvar_20 = tmpvar_12;
    tmpvar_21 = tmpvar_13;
    bool hit_23;
    float minT_24;
    minT_24 = -1.0;
    hit_23 = bool(0);
    for (int i_22 = 0; i_22 < 10; i_22++) {
      vec4 sphere_25;
      sphere_25 = spheres[i_22];
      int tmpvar_26;
      float tmpvar_27;
      vec3 tmpvar_28;
      vec3 tmpvar_29;
      vec3 tmpvar_30;
      bool tmpvar_31;
      float t_32;
      float t2_33;
      float t1_34;
      vec3 tmpvar_35;
      tmpvar_35 = (tmpvar_15 - sphere_25.xyz);
      float tmpvar_36;
      tmpvar_36 = (dot (tmpvar_35, tmpvar_16) * 2.0);
      float tmpvar_37;
      tmpvar_37 = dot (tmpvar_16, tmpvar_16);
      float tmpvar_38;
      tmpvar_38 = ((tmpvar_36 * tmpvar_36) - ((4.0 * tmpvar_37) * (
        dot (tmpvar_35, tmpvar_35)
       - 
        (sphere_25.w * sphere_25.w)
      )));
      if ((tmpvar_38 < 0.0)) {
        tmpvar_31 = bool(0);
      } else {
        float tmpvar_39;
        tmpvar_39 = sqrt(tmpvar_38);
        float tmpvar_40;
        tmpvar_40 = (((
          -(tmpvar_36)
         + tmpvar_39) / 2.0) / tmpvar_37);
        t1_34 = tmpvar_40;
        float tmpvar_41;
        tmpvar_41 = (((
          -(tmpvar_36)
         - tmpvar_39) / 2.0) / tmpvar_37);
        t2_33 = tmpvar_41;
        if ((tmpvar_40 < 0.001)) {
          t1_34 = -0.001;
        };
        if ((tmpvar_41 < 0.001)) {
          t2_33 = -0.001;
        };
        if ((t1_34 < 0.0)) {
          tmpvar_31 = bool(0);
        } else {
          if ((t2_33 > 0.0)) {
            t_32 = t2_33;
          } else {
            t_32 = t1_34;
          };
          tmpvar_26 = i_22;
          tmpvar_27 = t_32;
          tmpvar_30 = sphere_25.xyz;
          tmpvar_28 = (tmpvar_15 + (t_32 * tmpvar_16));
          tmpvar_29 = normalize((tmpvar_28 - sphere_25.xyz));
          tmpvar_31 = bool(1);
        };
      };
      if (tmpvar_31) {
        if (((tmpvar_27 < minT_24) || (minT_24 < 0.0))) {
          minT_24 = tmpvar_27;
          tmpvar_17 = tmpvar_26;
          tmpvar_18 = tmpvar_27;
          tmpvar_19 = tmpvar_28;
          tmpvar_20 = tmpvar_29;
          tmpvar_21 = tmpvar_30;
        };
        hit_23 = bool(1);
      };
    };
    float tmpvar_42;
    vec3 tmpvar_43;
    bool tmpvar_44;
    float t1_45;
    float v_46;
    float u_47;
    float invDet_48;
    vec3 T_49;
    vec3 tmpvar_50;
    tmpvar_50 = ((tmpvar_16.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_16.zxy * vec3(-19.0, 2.0, 28.0)));
    invDet_48 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_50)));
    T_49 = (tmpvar_15 - vec3(-14.0, 14.0, -14.0));
    u_47 = (dot (T_49, tmpvar_50) * invDet_48);
    if (((u_47 < 0.0) || (u_47 > 1.0))) {
      tmpvar_44 = bool(0);
    } else {
      vec3 tmpvar_51;
      tmpvar_51 = ((T_49.yzx * vec3(2.0, 0.0, -19.0)) - (T_49.zxy * vec3(-19.0, 2.0, 0.0)));
      v_46 = (dot (tmpvar_16, tmpvar_51) * invDet_48);
      if (((v_46 < 0.0) || ((u_47 + v_46) > 1.0))) {
        tmpvar_44 = bool(0);
      } else {
        t1_45 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_51) * invDet_48);
        if ((t1_45 > 0.001)) {
          tmpvar_42 = t1_45;
          tmpvar_43 = (tmpvar_15 + (tmpvar_16 * t1_45));
          tmpvar_44 = bool(1);
        } else {
          tmpvar_44 = bool(0);
        };
      };
    };
    if (tmpvar_44) {
      if (((tmpvar_42 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_42;
        tmpvar_17 = 10;
        tmpvar_18 = tmpvar_42;
        tmpvar_19 = tmpvar_43;
        tmpvar_20 = vec3(0.0, 0.1046848, 0.9945055);
        tmpvar_21 = vec3(-4.666667, 1.333333, -12.66667);
      };
      hit_23 = bool(1);
    };
    float tmpvar_52;
    vec3 tmpvar_53;
    bool tmpvar_54;
    float t1_55;
    float v_56;
    float u_57;
    float invDet_58;
    vec3 T_59;
    vec3 tmpvar_60;
    tmpvar_60 = ((tmpvar_16.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_16.zxy * vec3(0.0, 0.0, 28.0)));
    invDet_58 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_60)));
    T_59 = (tmpvar_15 - vec3(-14.0, 14.0, -14.0));
    u_57 = (dot (T_59, tmpvar_60) * invDet_58);
    if (((u_57 < 0.0) || (u_57 > 1.0))) {
      tmpvar_54 = bool(0);
    } else {
      vec3 tmpvar_61;
      tmpvar_61 = ((T_59.yzx * vec3(2.0, 28.0, -19.0)) - (T_59.zxy * vec3(-19.0, 2.0, 28.0)));
      v_56 = (dot (tmpvar_16, tmpvar_61) * invDet_58);
      if (((v_56 < 0.0) || ((u_57 + v_56) > 1.0))) {
        tmpvar_54 = bool(0);
      } else {
        t1_55 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_61) * invDet_58);
        if ((t1_55 > 0.001)) {
          tmpvar_52 = t1_55;
          tmpvar_53 = (tmpvar_15 + (tmpvar_16 * t1_55));
          tmpvar_54 = bool(1);
        } else {
          tmpvar_54 = bool(0);
        };
      };
    };
    if (tmpvar_54) {
      if (((tmpvar_52 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_52;
        tmpvar_17 = 11;
        tmpvar_18 = tmpvar_52;
        tmpvar_19 = tmpvar_53;
        tmpvar_20 = vec3(-0.0, 0.1046848, 0.9945055);
        tmpvar_21 = vec3(4.666667, 7.666667, -13.33333);
      };
      hit_23 = bool(1);
    };
    bool tmpvar_62;
    float tmpvar_63;
    vec3 tmpvar_64;
    bool tmpvar_65;
    float tmpvar_66;
    tmpvar_66 = ((vec3(0.0, -10.0, 0.0) - tmpvar_15).y / tmpvar_16.y);
    if ((tmpvar_66 < 0.001)) {
      tmpvar_65 = bool(0);
    } else {
      tmpvar_63 = tmpvar_66;
      tmpvar_64 = (tmpvar_15 + (tmpvar_66 * tmpvar_16));
      tmpvar_65 = bool(1);
    };
    if (tmpvar_65) {
      vec3 tmpvar_67;
      tmpvar_67 = ((tmpvar_15 + (tmpvar_63 * tmpvar_16)) - vec3(0.0, -10.0, 0.0));
      float tmpvar_68;
      tmpvar_68 = sqrt(dot (tmpvar_67, tmpvar_67));
      if ((tmpvar_68 > 30.0)) {
        tmpvar_62 = bool(0);
      } else {
        tmpvar_62 = bool(1);
      };
    } else {
      tmpvar_62 = bool(0);
    };
    if (tmpvar_62) {
      if (((tmpvar_63 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_63;
        tmpvar_17 = 12;
        tmpvar_18 = tmpvar_63;
        tmpvar_19 = tmpvar_64;
        tmpvar_20 = vec3(0.0, 1.0, 0.0);
        tmpvar_21 = vec3(0.0, -10.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_69;
    vec3 tmpvar_70;
    bool tmpvar_71;
    float tmpvar_72;
    tmpvar_72 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_15)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_16));
    if ((tmpvar_72 < 0.001)) {
      tmpvar_71 = bool(0);
    } else {
      tmpvar_69 = tmpvar_72;
      tmpvar_70 = (tmpvar_15 + (tmpvar_72 * tmpvar_16));
      tmpvar_71 = bool(1);
    };
    if (tmpvar_71) {
      if (((tmpvar_69 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_69;
        tmpvar_17 = 14;
        tmpvar_18 = tmpvar_69;
        tmpvar_19 = tmpvar_70;
        tmpvar_20 = vec3(0.0, 0.0, -1.0);
        tmpvar_21 = vec3(0.0, 0.0, 10000.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_73;
    vec3 tmpvar_74;
    bool tmpvar_75;
    float tmpvar_76;
    tmpvar_76 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_15).y / tmpvar_16.y);
    if ((tmpvar_76 < 0.001)) {
      tmpvar_75 = bool(0);
    } else {
      tmpvar_73 = tmpvar_76;
      tmpvar_74 = (tmpvar_15 + (tmpvar_76 * tmpvar_16));
      tmpvar_75 = bool(1);
    };
    if (tmpvar_75) {
      if (((tmpvar_73 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_73;
        tmpvar_17 = 15;
        tmpvar_18 = tmpvar_73;
        tmpvar_19 = tmpvar_74;
        tmpvar_20 = vec3(0.0, 1.0, 0.0);
        tmpvar_21 = vec3(0.0, -10000.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_77;
    vec3 tmpvar_78;
    bool tmpvar_79;
    float tmpvar_80;
    tmpvar_80 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_15).z / tmpvar_16.z);
    if ((tmpvar_80 < 0.001)) {
      tmpvar_79 = bool(0);
    } else {
      tmpvar_77 = tmpvar_80;
      tmpvar_78 = (tmpvar_15 + (tmpvar_80 * tmpvar_16));
      tmpvar_79 = bool(1);
    };
    if (tmpvar_79) {
      if (((tmpvar_77 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_77;
        tmpvar_17 = 16;
        tmpvar_18 = tmpvar_77;
        tmpvar_19 = tmpvar_78;
        tmpvar_20 = vec3(0.0, 0.0, 1.0);
        tmpvar_21 = vec3(0.0, 0.0, -10000.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_81;
    vec3 tmpvar_82;
    bool tmpvar_83;
    float tmpvar_84;
    tmpvar_84 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_15).x / tmpvar_16.x);
    if ((tmpvar_84 < 0.001)) {
      tmpvar_83 = bool(0);
    } else {
      tmpvar_81 = tmpvar_84;
      tmpvar_82 = (tmpvar_15 + (tmpvar_84 * tmpvar_16));
      tmpvar_83 = bool(1);
    };
    if (tmpvar_83) {
      if (((tmpvar_81 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_81;
        tmpvar_17 = 17;
        tmpvar_18 = tmpvar_81;
        tmpvar_19 = tmpvar_82;
        tmpvar_20 = vec3(1.0, 0.0, 0.0);
        tmpvar_21 = vec3(-10000.0, 0.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_85;
    vec3 tmpvar_86;
    bool tmpvar_87;
    float tmpvar_88;
    tmpvar_88 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_15)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_16));
    if ((tmpvar_88 < 0.001)) {
      tmpvar_87 = bool(0);
    } else {
      tmpvar_85 = tmpvar_88;
      tmpvar_86 = (tmpvar_15 + (tmpvar_88 * tmpvar_16));
      tmpvar_87 = bool(1);
    };
    if (tmpvar_87) {
      if (((tmpvar_85 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_85;
        tmpvar_17 = 18;
        tmpvar_18 = tmpvar_85;
        tmpvar_19 = tmpvar_86;
        tmpvar_20 = vec3(-1.0, 0.0, 0.0);
        tmpvar_21 = vec3(10000.0, 0.0, 0.0);
      };
      hit_23 = bool(1);
    };
    float tmpvar_89;
    vec3 tmpvar_90;
    bool tmpvar_91;
    float tmpvar_92;
    tmpvar_92 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_15)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_16));
    if ((tmpvar_92 < 0.001)) {
      tmpvar_91 = bool(0);
    } else {
      tmpvar_89 = tmpvar_92;
      tmpvar_90 = (tmpvar_15 + (tmpvar_92 * tmpvar_16));
      tmpvar_91 = bool(1);
    };
    if (tmpvar_91) {
      if (((tmpvar_89 < minT_24) || (minT_24 < 0.0))) {
        minT_24 = tmpvar_89;
        tmpvar_17 = 19;
        tmpvar_18 = tmpvar_89;
        tmpvar_19 = tmpvar_90;
        tmpvar_20 = vec3(0.0, -1.0, 0.0);
        tmpvar_21 = vec3(0.0, 10000.0, 0.0);
      };
      hit_23 = bool(1);
    };
    tmpvar_9 = tmpvar_17;
    tmpvar_10 = tmpvar_18;
    tmpvar_11 = tmpvar_19;
    tmpvar_12 = tmpvar_20;
    tmpvar_13 = tmpvar_21;
    if (hit_23) {
      float vec_y_93;
      vec_y_93 = -(tmpvar_20.z);
      float vec_x_94;
      vec_x_94 = -(tmpvar_20.x);
      float tmpvar_95;
      float tmpvar_96;
      tmpvar_96 = (min (abs(
        (vec_y_93 / vec_x_94)
      ), 1.0) / max (abs(
        (vec_y_93 / vec_x_94)
      ), 1.0));
      float tmpvar_97;
      tmpvar_97 = (tmpvar_96 * tmpvar_96);
      tmpvar_97 = (((
        ((((
          ((((-0.01213232 * tmpvar_97) + 0.05368138) * tmpvar_97) - 0.1173503)
         * tmpvar_97) + 0.1938925) * tmpvar_97) - 0.3326756)
       * tmpvar_97) + 0.9999793) * tmpvar_96);
      tmpvar_97 = (tmpvar_97 + (float(
        (abs((vec_y_93 / vec_x_94)) > 1.0)
      ) * (
        (tmpvar_97 * -2.0)
       + 1.570796)));
      tmpvar_95 = (tmpvar_97 * sign((vec_y_93 / vec_x_94)));
      if ((abs(vec_x_94) > (1e-08 * abs(vec_y_93)))) {
        if ((vec_x_94 < 0.0)) {
          if ((vec_y_93 >= 0.0)) {
            tmpvar_95 += 3.141593;
          } else {
            tmpvar_95 = (tmpvar_95 - 3.141593);
          };
        };
      } else {
        tmpvar_95 = (sign(vec_y_93) * 1.570796);
      };
      u_8 = (0.5 - (tmpvar_95 / 6.283185));
      float x_98;
      x_98 = -(tmpvar_20.y);
      v_7 = (0.5 + ((
        sign(x_98)
       * 
        (1.570796 - (sqrt((1.0 - 
          abs(x_98)
        )) * (1.570796 + (
          abs(x_98)
         * 
          (-0.2146018 + (abs(x_98) * (0.08656672 + (
            abs(x_98)
           * -0.03102955))))
        ))))
      ) / 3.141593));
      if (useNormalMap) {
        if ((tmpvar_17 == 3)) {
          vec3 normalFromMap_99;
          u_8 = (u_8 + (time / 2.0));
          vec2 tmpvar_100;
          tmpvar_100.x = u_8;
          tmpvar_100.y = v_7;
          normalFromMap_99 = normalize(((2.0 * texture2D (earthNormalMap, tmpvar_100).xyz) - 1.0));
          mat3 tmpvar_101;
          float tmpvar_102;
          tmpvar_102 = (1.570796 - (sign(tmpvar_20.z) * (1.570796 - 
            (sqrt((1.0 - abs(tmpvar_20.z))) * (1.570796 + (abs(tmpvar_20.z) * (-0.2146018 + 
              (abs(tmpvar_20.z) * (0.08656672 + (abs(tmpvar_20.z) * -0.03102955)))
            ))))
          )));
          vec3 tmpvar_103;
          tmpvar_103 = ((tmpvar_20.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_20.zxy * vec3(0.0, 1.0, 0.0)));
          float tmpvar_104;
          tmpvar_104 = sqrt(dot (tmpvar_103, tmpvar_103));
          if ((tmpvar_104 < 0.001)) {
            tmpvar_101 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
          } else {
            vec3 tmpvar_105;
            tmpvar_105 = normalize(tmpvar_103);
            float tmpvar_106;
            tmpvar_106 = sin(tmpvar_102);
            float tmpvar_107;
            tmpvar_107 = cos(tmpvar_102);
            float tmpvar_108;
            tmpvar_108 = (1.0 - tmpvar_107);
            mat3 tmpvar_109;
            tmpvar_109[0].x = (((tmpvar_108 * tmpvar_105.x) * tmpvar_105.x) + tmpvar_107);
            tmpvar_109[0].y = (((tmpvar_108 * tmpvar_105.x) * tmpvar_105.y) - (tmpvar_105.z * tmpvar_106));
            tmpvar_109[0].z = (((tmpvar_108 * tmpvar_105.z) * tmpvar_105.x) + (tmpvar_105.y * tmpvar_106));
            tmpvar_109[1].x = (((tmpvar_108 * tmpvar_105.x) * tmpvar_105.y) + (tmpvar_105.z * tmpvar_106));
            tmpvar_109[1].y = (((tmpvar_108 * tmpvar_105.y) * tmpvar_105.y) + tmpvar_107);
            tmpvar_109[1].z = (((tmpvar_108 * tmpvar_105.y) * tmpvar_105.z) - (tmpvar_105.x * tmpvar_106));
            tmpvar_109[2].x = (((tmpvar_108 * tmpvar_105.z) * tmpvar_105.x) - (tmpvar_105.y * tmpvar_106));
            tmpvar_109[2].y = (((tmpvar_108 * tmpvar_105.y) * tmpvar_105.z) + (tmpvar_105.x * tmpvar_106));
            tmpvar_109[2].z = (((tmpvar_108 * tmpvar_105.z) * tmpvar_105.z) + tmpvar_107);
            tmpvar_101 = tmpvar_109;
          };
          tmpvar_12 = (tmpvar_101 * normalFromMap_99);
        } else {
          if ((tmpvar_17 == 4)) {
            vec3 normalFromMap_110;
            u_8 = (u_8 + (time / 7.0));
            vec2 tmpvar_111;
            tmpvar_111.x = u_8;
            tmpvar_111.y = v_7;
            normalFromMap_110 = normalize(((2.0 * texture2D (moonNormalMap, tmpvar_111).xyz) - 1.0));
            mat3 tmpvar_112;
            float tmpvar_113;
            tmpvar_113 = (1.570796 - (sign(tmpvar_12.z) * (1.570796 - 
              (sqrt((1.0 - abs(tmpvar_12.z))) * (1.570796 + (abs(tmpvar_12.z) * (-0.2146018 + 
                (abs(tmpvar_12.z) * (0.08656672 + (abs(tmpvar_12.z) * -0.03102955)))
              ))))
            )));
            vec3 tmpvar_114;
            tmpvar_114 = ((tmpvar_12.yzx * vec3(1.0, 0.0, 0.0)) - (tmpvar_12.zxy * vec3(0.0, 1.0, 0.0)));
            float tmpvar_115;
            tmpvar_115 = sqrt(dot (tmpvar_114, tmpvar_114));
            if ((tmpvar_115 < 0.001)) {
              tmpvar_112 = mat3(1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0);
            } else {
              vec3 tmpvar_116;
              tmpvar_116 = normalize(tmpvar_114);
              float tmpvar_117;
              tmpvar_117 = sin(tmpvar_113);
              float tmpvar_118;
              tmpvar_118 = cos(tmpvar_113);
              float tmpvar_119;
              tmpvar_119 = (1.0 - tmpvar_118);
              mat3 tmpvar_120;
              tmpvar_120[0].x = (((tmpvar_119 * tmpvar_116.x) * tmpvar_116.x) + tmpvar_118);
              tmpvar_120[0].y = (((tmpvar_119 * tmpvar_116.x) * tmpvar_116.y) - (tmpvar_116.z * tmpvar_117));
              tmpvar_120[0].z = (((tmpvar_119 * tmpvar_116.z) * tmpvar_116.x) + (tmpvar_116.y * tmpvar_117));
              tmpvar_120[1].x = (((tmpvar_119 * tmpvar_116.x) * tmpvar_116.y) + (tmpvar_116.z * tmpvar_117));
              tmpvar_120[1].y = (((tmpvar_119 * tmpvar_116.y) * tmpvar_116.y) + tmpvar_118);
              tmpvar_120[1].z = (((tmpvar_119 * tmpvar_116.y) * tmpvar_116.z) - (tmpvar_116.x * tmpvar_117));
              tmpvar_120[2].x = (((tmpvar_119 * tmpvar_116.z) * tmpvar_116.x) - (tmpvar_116.y * tmpvar_117));
              tmpvar_120[2].y = (((tmpvar_119 * tmpvar_116.y) * tmpvar_116.z) + (tmpvar_116.x * tmpvar_117));
              tmpvar_120[2].z = (((tmpvar_119 * tmpvar_116.z) * tmpvar_116.z) + tmpvar_118);
              tmpvar_112 = tmpvar_120;
            };
            tmpvar_12 = (tmpvar_112 * normalFromMap_110);
          };
        };
      };
      bounceCount_4++;
      vec3 tmpvar_121;
      bool tmpvar_122;
      bool tmpvar_123;
      vec3 tmpvar_124;
      float tmpvar_125;
      Material tmpvar_126;
      if ((tmpvar_17 == 0)) {
        tmpvar_126 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
      } else {
        if ((tmpvar_17 == 1)) {
          tmpvar_126 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 2)) {
            tmpvar_126 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 3)) {
              tmpvar_126 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 4)) {
                tmpvar_126 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 5)) {
                  tmpvar_126 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 6)) {
                    tmpvar_126 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 7)) {
                      tmpvar_126 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 8)) {
                        tmpvar_126 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                      } else {
                        if ((tmpvar_17 == 9)) {
                          tmpvar_126 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                        } else {
                          if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                            tmpvar_126 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                          } else {
                            if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                              tmpvar_126 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if ((tmpvar_17 == 12)) {
                                tmpvar_126 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                              } else {
                                if ((tmpvar_17 > 13)) {
                                  tmpvar_126 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  tmpvar_126 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      tmpvar_121 = tmpvar_126.amb;
      tmpvar_122 = tmpvar_126.refractive;
      tmpvar_123 = tmpvar_126.reflective;
      tmpvar_124 = tmpvar_126.f0;
      tmpvar_125 = tmpvar_126.n;
      vec3 tmpvar_127;
      if ((tmpvar_17 == 0)) {
        tmpvar_127 = tmpvar_121;
      } else {
        float diffintensity_128;
        vec3 toLight_129;
        vec3 specular_130;
        vec3 diffuse_131;
        vec3 color_132;
        vec3 refDir_133;
        vec3 I_134;
        I_134 = (tmpvar_19 - ray_1.origin);
        refDir_133 = normalize((I_134 - (2.0 * 
          (dot (tmpvar_12, I_134) * tmpvar_12)
        )));
        vec3 tmpvar_135;
        Material tmpvar_136;
        if ((tmpvar_17 == 0)) {
          tmpvar_136 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_136 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_136 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_136 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_136 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_136 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_136 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_136 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_136 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_136 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_136 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_136 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_136 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_136 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_136 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_135 = tmpvar_136.amb;
        color_132 = tmpvar_135;
        diffuse_131 = vec3(0.0, 0.0, 0.0);
        specular_130 = vec3(0.0, 0.0, 0.0);
        vec3 tmpvar_137;
        tmpvar_137 = normalize(-(tmpvar_19));
        toLight_129 = tmpvar_137;
        diffintensity_128 = clamp (dot (tmpvar_12, tmpvar_137), 0.0, 1.0);
        vec3 tmpvar_138;
        Material tmpvar_139;
        if ((tmpvar_17 == 0)) {
          tmpvar_139 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_139 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_139 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_139 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_139 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_139 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_139 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_139 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_139 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_139 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_139 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_139 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_139 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_139 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_139 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_138 = tmpvar_139.spec;
        float tmpvar_140;
        tmpvar_140 = clamp (dot (tmpvar_137, refDir_133), 0.0, 1.0);
        Material tmpvar_141;
        if ((tmpvar_17 == 0)) {
          tmpvar_141 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_141 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_141 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_141 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_141 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_141 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_141 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_141 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_130 = clamp ((tmpvar_138 * pow (tmpvar_140, tmpvar_141.pow)), 0.0, 1.0);
        Material tmpvar_142;
        if ((tmpvar_17 == 0)) {
          tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_142 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_142 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_142 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_142 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_142 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_142 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_142 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_131 = clamp ((tmpvar_142.dif * diffintensity_128), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_143;
          vec3 tmpvar_144;
          tmpvar_143 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_144 = normalize(-(tmpvar_19));
          int tmpvar_145;
          tmpvar_145 = tmpvar_17;
          int i_146;
          float minT_147;
          minT_147 = -1.0;
          i_146 = 0;
          while (true) {
            if ((i_146 >= 10)) {
              break;
            };
            vec4 sphere_148;
            sphere_148 = spheres[i_146];
            int tmpvar_149;
            float tmpvar_150;
            bool tmpvar_151;
            float t_152;
            float t2_153;
            float t1_154;
            vec3 tmpvar_155;
            tmpvar_155 = (tmpvar_143 - sphere_148.xyz);
            float tmpvar_156;
            tmpvar_156 = (dot (tmpvar_155, tmpvar_144) * 2.0);
            float tmpvar_157;
            tmpvar_157 = dot (tmpvar_144, tmpvar_144);
            float tmpvar_158;
            tmpvar_158 = ((tmpvar_156 * tmpvar_156) - ((4.0 * tmpvar_157) * (
              dot (tmpvar_155, tmpvar_155)
             - 
              (sphere_148.w * sphere_148.w)
            )));
            if ((tmpvar_158 < 0.0)) {
              tmpvar_151 = bool(0);
            } else {
              float tmpvar_159;
              tmpvar_159 = sqrt(tmpvar_158);
              float tmpvar_160;
              tmpvar_160 = (((
                -(tmpvar_156)
               + tmpvar_159) / 2.0) / tmpvar_157);
              t1_154 = tmpvar_160;
              float tmpvar_161;
              tmpvar_161 = (((
                -(tmpvar_156)
               - tmpvar_159) / 2.0) / tmpvar_157);
              t2_153 = tmpvar_161;
              if ((tmpvar_160 < 0.001)) {
                t1_154 = -0.001;
              };
              if ((tmpvar_161 < 0.001)) {
                t2_153 = -0.001;
              };
              if ((t1_154 < 0.0)) {
                tmpvar_151 = bool(0);
              } else {
                if ((t2_153 > 0.0)) {
                  t_152 = t2_153;
                } else {
                  t_152 = t1_154;
                };
                tmpvar_149 = i_146;
                tmpvar_150 = t_152;
                tmpvar_151 = bool(1);
              };
            };
            if ((tmpvar_151 && ((tmpvar_150 < minT_147) || (minT_147 < 0.0)))) {
              minT_147 = tmpvar_150;
              tmpvar_145 = tmpvar_149;
            };
            i_146++;
          };
          float tmpvar_162;
          bool tmpvar_163;
          float t1_164;
          float v_165;
          float u_166;
          float invDet_167;
          vec3 T_168;
          vec3 tmpvar_169;
          tmpvar_169 = ((tmpvar_144.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_144.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_167 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_169)));
          T_168 = (tmpvar_143 - vec3(-14.0, 14.0, -14.0));
          u_166 = (dot (T_168, tmpvar_169) * invDet_167);
          if (((u_166 < 0.0) || (u_166 > 1.0))) {
            tmpvar_163 = bool(0);
          } else {
            vec3 tmpvar_170;
            tmpvar_170 = ((T_168.yzx * vec3(2.0, 0.0, -19.0)) - (T_168.zxy * vec3(-19.0, 2.0, 0.0)));
            v_165 = (dot (tmpvar_144, tmpvar_170) * invDet_167);
            if (((v_165 < 0.0) || ((u_166 + v_165) > 1.0))) {
              tmpvar_163 = bool(0);
            } else {
              t1_164 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_170) * invDet_167);
              if ((t1_164 > 0.001)) {
                tmpvar_162 = t1_164;
                tmpvar_163 = bool(1);
              } else {
                tmpvar_163 = bool(0);
              };
            };
          };
          if ((tmpvar_163 && ((tmpvar_162 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_162;
            tmpvar_145 = 10;
          };
          float tmpvar_171;
          bool tmpvar_172;
          float t1_173;
          float v_174;
          float u_175;
          float invDet_176;
          vec3 T_177;
          vec3 tmpvar_178;
          tmpvar_178 = ((tmpvar_144.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_144.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_176 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_178)));
          T_177 = (tmpvar_143 - vec3(-14.0, 14.0, -14.0));
          u_175 = (dot (T_177, tmpvar_178) * invDet_176);
          if (((u_175 < 0.0) || (u_175 > 1.0))) {
            tmpvar_172 = bool(0);
          } else {
            vec3 tmpvar_179;
            tmpvar_179 = ((T_177.yzx * vec3(2.0, 28.0, -19.0)) - (T_177.zxy * vec3(-19.0, 2.0, 28.0)));
            v_174 = (dot (tmpvar_144, tmpvar_179) * invDet_176);
            if (((v_174 < 0.0) || ((u_175 + v_174) > 1.0))) {
              tmpvar_172 = bool(0);
            } else {
              t1_173 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_179) * invDet_176);
              if ((t1_173 > 0.001)) {
                tmpvar_171 = t1_173;
                tmpvar_172 = bool(1);
              } else {
                tmpvar_172 = bool(0);
              };
            };
          };
          if ((tmpvar_172 && ((tmpvar_171 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_171;
            tmpvar_145 = 11;
          };
          bool tmpvar_180;
          float tmpvar_181;
          bool tmpvar_182;
          float tmpvar_183;
          tmpvar_183 = ((vec3(0.0, -10.0, 0.0) - tmpvar_143).y / tmpvar_144.y);
          if ((tmpvar_183 < 0.001)) {
            tmpvar_182 = bool(0);
          } else {
            tmpvar_181 = tmpvar_183;
            tmpvar_182 = bool(1);
          };
          if (tmpvar_182) {
            vec3 tmpvar_184;
            tmpvar_184 = ((tmpvar_143 + (tmpvar_181 * tmpvar_144)) - vec3(0.0, -10.0, 0.0));
            float tmpvar_185;
            tmpvar_185 = sqrt(dot (tmpvar_184, tmpvar_184));
            if ((tmpvar_185 > 30.0)) {
              tmpvar_180 = bool(0);
            } else {
              tmpvar_180 = bool(1);
            };
          } else {
            tmpvar_180 = bool(0);
          };
          if ((tmpvar_180 && ((tmpvar_181 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_181;
            tmpvar_145 = 12;
          };
          float tmpvar_186;
          bool tmpvar_187;
          float tmpvar_188;
          tmpvar_188 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_143)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_144));
          if ((tmpvar_188 < 0.001)) {
            tmpvar_187 = bool(0);
          } else {
            tmpvar_186 = tmpvar_188;
            tmpvar_187 = bool(1);
          };
          if ((tmpvar_187 && ((tmpvar_186 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_186;
            tmpvar_145 = 14;
          };
          float tmpvar_189;
          bool tmpvar_190;
          float tmpvar_191;
          tmpvar_191 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_143).y / tmpvar_144.y);
          if ((tmpvar_191 < 0.001)) {
            tmpvar_190 = bool(0);
          } else {
            tmpvar_189 = tmpvar_191;
            tmpvar_190 = bool(1);
          };
          if ((tmpvar_190 && ((tmpvar_189 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_189;
            tmpvar_145 = 15;
          };
          float tmpvar_192;
          bool tmpvar_193;
          float tmpvar_194;
          tmpvar_194 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_143).z / tmpvar_144.z);
          if ((tmpvar_194 < 0.001)) {
            tmpvar_193 = bool(0);
          } else {
            tmpvar_192 = tmpvar_194;
            tmpvar_193 = bool(1);
          };
          if ((tmpvar_193 && ((tmpvar_192 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_192;
            tmpvar_145 = 16;
          };
          float tmpvar_195;
          bool tmpvar_196;
          float tmpvar_197;
          tmpvar_197 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_143).x / tmpvar_144.x);
          if ((tmpvar_197 < 0.001)) {
            tmpvar_196 = bool(0);
          } else {
            tmpvar_195 = tmpvar_197;
            tmpvar_196 = bool(1);
          };
          if ((tmpvar_196 && ((tmpvar_195 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_195;
            tmpvar_145 = 17;
          };
          float tmpvar_198;
          bool tmpvar_199;
          float tmpvar_200;
          tmpvar_200 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_143)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_144));
          if ((tmpvar_200 < 0.001)) {
            tmpvar_199 = bool(0);
          } else {
            tmpvar_198 = tmpvar_200;
            tmpvar_199 = bool(1);
          };
          if ((tmpvar_199 && ((tmpvar_198 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_198;
            tmpvar_145 = 18;
          };
          float tmpvar_201;
          bool tmpvar_202;
          float tmpvar_203;
          tmpvar_203 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_143)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_144));
          if ((tmpvar_203 < 0.001)) {
            tmpvar_202 = bool(0);
          } else {
            tmpvar_201 = tmpvar_203;
            tmpvar_202 = bool(1);
          };
          if ((tmpvar_202 && ((tmpvar_201 < minT_147) || (minT_147 < 0.0)))) {
            minT_147 = tmpvar_201;
            tmpvar_145 = 19;
          };
          if ((((
            (((tmpvar_145 != 0) && (tmpvar_145 != 5)) && (tmpvar_145 != 6))
           && 
            (tmpvar_145 != 12)
          ) && (tmpvar_145 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_130 = vec3(0.0, 0.0, 0.0);
            diffuse_131 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_132 = (tmpvar_135 + (diffuse_131 + specular_130));
        toLight_129 = (vec3(-2.0, 20.0, 0.0) - tmpvar_19);
        vec3 tmpvar_204;
        tmpvar_204 = normalize(toLight_129);
        toLight_129 = tmpvar_204;
        diffintensity_128 = clamp (dot (tmpvar_12, tmpvar_204), 0.0, 1.0);
        vec3 tmpvar_205;
        Material tmpvar_206;
        if ((tmpvar_17 == 0)) {
          tmpvar_206 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_206 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_206 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_206 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_206 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_206 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_206 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_206 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_206 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_206 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_206 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_206 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_206 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_206 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_206 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_205 = tmpvar_206.spec;
        float tmpvar_207;
        tmpvar_207 = clamp (dot (tmpvar_204, refDir_133), 0.0, 1.0);
        Material tmpvar_208;
        if ((tmpvar_17 == 0)) {
          tmpvar_208 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_208 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_208 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_208 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_208 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_208 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_208 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_208 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_130 = clamp ((tmpvar_205 * pow (tmpvar_207, tmpvar_208.pow)), 0.0, 1.0);
        Material tmpvar_209;
        if ((tmpvar_17 == 0)) {
          tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_209 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_209 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_209 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_209 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_209 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_209 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_209 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_131 = clamp ((tmpvar_209.dif * diffintensity_128), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_210;
          vec3 tmpvar_211;
          tmpvar_210 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_211 = normalize((vec3(-2.0, 20.0, 0.0) - tmpvar_19));
          int tmpvar_212;
          tmpvar_212 = tmpvar_17;
          int i_213;
          float minT_214;
          minT_214 = -1.0;
          i_213 = 0;
          while (true) {
            if ((i_213 >= 10)) {
              break;
            };
            vec4 sphere_215;
            sphere_215 = spheres[i_213];
            int tmpvar_216;
            float tmpvar_217;
            bool tmpvar_218;
            float t_219;
            float t2_220;
            float t1_221;
            vec3 tmpvar_222;
            tmpvar_222 = (tmpvar_210 - sphere_215.xyz);
            float tmpvar_223;
            tmpvar_223 = (dot (tmpvar_222, tmpvar_211) * 2.0);
            float tmpvar_224;
            tmpvar_224 = dot (tmpvar_211, tmpvar_211);
            float tmpvar_225;
            tmpvar_225 = ((tmpvar_223 * tmpvar_223) - ((4.0 * tmpvar_224) * (
              dot (tmpvar_222, tmpvar_222)
             - 
              (sphere_215.w * sphere_215.w)
            )));
            if ((tmpvar_225 < 0.0)) {
              tmpvar_218 = bool(0);
            } else {
              float tmpvar_226;
              tmpvar_226 = sqrt(tmpvar_225);
              float tmpvar_227;
              tmpvar_227 = (((
                -(tmpvar_223)
               + tmpvar_226) / 2.0) / tmpvar_224);
              t1_221 = tmpvar_227;
              float tmpvar_228;
              tmpvar_228 = (((
                -(tmpvar_223)
               - tmpvar_226) / 2.0) / tmpvar_224);
              t2_220 = tmpvar_228;
              if ((tmpvar_227 < 0.001)) {
                t1_221 = -0.001;
              };
              if ((tmpvar_228 < 0.001)) {
                t2_220 = -0.001;
              };
              if ((t1_221 < 0.0)) {
                tmpvar_218 = bool(0);
              } else {
                if ((t2_220 > 0.0)) {
                  t_219 = t2_220;
                } else {
                  t_219 = t1_221;
                };
                tmpvar_216 = i_213;
                tmpvar_217 = t_219;
                tmpvar_218 = bool(1);
              };
            };
            if ((tmpvar_218 && ((tmpvar_217 < minT_214) || (minT_214 < 0.0)))) {
              minT_214 = tmpvar_217;
              tmpvar_212 = tmpvar_216;
            };
            i_213++;
          };
          float tmpvar_229;
          bool tmpvar_230;
          float t1_231;
          float v_232;
          float u_233;
          float invDet_234;
          vec3 T_235;
          vec3 tmpvar_236;
          tmpvar_236 = ((tmpvar_211.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_211.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_234 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_236)));
          T_235 = (tmpvar_210 - vec3(-14.0, 14.0, -14.0));
          u_233 = (dot (T_235, tmpvar_236) * invDet_234);
          if (((u_233 < 0.0) || (u_233 > 1.0))) {
            tmpvar_230 = bool(0);
          } else {
            vec3 tmpvar_237;
            tmpvar_237 = ((T_235.yzx * vec3(2.0, 0.0, -19.0)) - (T_235.zxy * vec3(-19.0, 2.0, 0.0)));
            v_232 = (dot (tmpvar_211, tmpvar_237) * invDet_234);
            if (((v_232 < 0.0) || ((u_233 + v_232) > 1.0))) {
              tmpvar_230 = bool(0);
            } else {
              t1_231 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_237) * invDet_234);
              if ((t1_231 > 0.001)) {
                tmpvar_229 = t1_231;
                tmpvar_230 = bool(1);
              } else {
                tmpvar_230 = bool(0);
              };
            };
          };
          if ((tmpvar_230 && ((tmpvar_229 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_229;
            tmpvar_212 = 10;
          };
          float tmpvar_238;
          bool tmpvar_239;
          float t1_240;
          float v_241;
          float u_242;
          float invDet_243;
          vec3 T_244;
          vec3 tmpvar_245;
          tmpvar_245 = ((tmpvar_211.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_211.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_243 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_245)));
          T_244 = (tmpvar_210 - vec3(-14.0, 14.0, -14.0));
          u_242 = (dot (T_244, tmpvar_245) * invDet_243);
          if (((u_242 < 0.0) || (u_242 > 1.0))) {
            tmpvar_239 = bool(0);
          } else {
            vec3 tmpvar_246;
            tmpvar_246 = ((T_244.yzx * vec3(2.0, 28.0, -19.0)) - (T_244.zxy * vec3(-19.0, 2.0, 28.0)));
            v_241 = (dot (tmpvar_211, tmpvar_246) * invDet_243);
            if (((v_241 < 0.0) || ((u_242 + v_241) > 1.0))) {
              tmpvar_239 = bool(0);
            } else {
              t1_240 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_246) * invDet_243);
              if ((t1_240 > 0.001)) {
                tmpvar_238 = t1_240;
                tmpvar_239 = bool(1);
              } else {
                tmpvar_239 = bool(0);
              };
            };
          };
          if ((tmpvar_239 && ((tmpvar_238 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_238;
            tmpvar_212 = 11;
          };
          bool tmpvar_247;
          float tmpvar_248;
          bool tmpvar_249;
          float tmpvar_250;
          tmpvar_250 = ((vec3(0.0, -10.0, 0.0) - tmpvar_210).y / tmpvar_211.y);
          if ((tmpvar_250 < 0.001)) {
            tmpvar_249 = bool(0);
          } else {
            tmpvar_248 = tmpvar_250;
            tmpvar_249 = bool(1);
          };
          if (tmpvar_249) {
            vec3 tmpvar_251;
            tmpvar_251 = ((tmpvar_210 + (tmpvar_248 * tmpvar_211)) - vec3(0.0, -10.0, 0.0));
            float tmpvar_252;
            tmpvar_252 = sqrt(dot (tmpvar_251, tmpvar_251));
            if ((tmpvar_252 > 30.0)) {
              tmpvar_247 = bool(0);
            } else {
              tmpvar_247 = bool(1);
            };
          } else {
            tmpvar_247 = bool(0);
          };
          if ((tmpvar_247 && ((tmpvar_248 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_248;
            tmpvar_212 = 12;
          };
          float tmpvar_253;
          bool tmpvar_254;
          float tmpvar_255;
          tmpvar_255 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_210)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_211));
          if ((tmpvar_255 < 0.001)) {
            tmpvar_254 = bool(0);
          } else {
            tmpvar_253 = tmpvar_255;
            tmpvar_254 = bool(1);
          };
          if ((tmpvar_254 && ((tmpvar_253 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_253;
            tmpvar_212 = 14;
          };
          float tmpvar_256;
          bool tmpvar_257;
          float tmpvar_258;
          tmpvar_258 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_210).y / tmpvar_211.y);
          if ((tmpvar_258 < 0.001)) {
            tmpvar_257 = bool(0);
          } else {
            tmpvar_256 = tmpvar_258;
            tmpvar_257 = bool(1);
          };
          if ((tmpvar_257 && ((tmpvar_256 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_256;
            tmpvar_212 = 15;
          };
          float tmpvar_259;
          bool tmpvar_260;
          float tmpvar_261;
          tmpvar_261 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_210).z / tmpvar_211.z);
          if ((tmpvar_261 < 0.001)) {
            tmpvar_260 = bool(0);
          } else {
            tmpvar_259 = tmpvar_261;
            tmpvar_260 = bool(1);
          };
          if ((tmpvar_260 && ((tmpvar_259 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_259;
            tmpvar_212 = 16;
          };
          float tmpvar_262;
          bool tmpvar_263;
          float tmpvar_264;
          tmpvar_264 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_210).x / tmpvar_211.x);
          if ((tmpvar_264 < 0.001)) {
            tmpvar_263 = bool(0);
          } else {
            tmpvar_262 = tmpvar_264;
            tmpvar_263 = bool(1);
          };
          if ((tmpvar_263 && ((tmpvar_262 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_262;
            tmpvar_212 = 17;
          };
          float tmpvar_265;
          bool tmpvar_266;
          float tmpvar_267;
          tmpvar_267 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_210)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_211));
          if ((tmpvar_267 < 0.001)) {
            tmpvar_266 = bool(0);
          } else {
            tmpvar_265 = tmpvar_267;
            tmpvar_266 = bool(1);
          };
          if ((tmpvar_266 && ((tmpvar_265 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_265;
            tmpvar_212 = 18;
          };
          float tmpvar_268;
          bool tmpvar_269;
          float tmpvar_270;
          tmpvar_270 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_210)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_211));
          if ((tmpvar_270 < 0.001)) {
            tmpvar_269 = bool(0);
          } else {
            tmpvar_268 = tmpvar_270;
            tmpvar_269 = bool(1);
          };
          if ((tmpvar_269 && ((tmpvar_268 < minT_214) || (minT_214 < 0.0)))) {
            minT_214 = tmpvar_268;
            tmpvar_212 = 19;
          };
          if ((((
            (((tmpvar_212 != 0) && (tmpvar_212 != 5)) && (tmpvar_212 != 6))
           && 
            (tmpvar_212 != 12)
          ) && (tmpvar_212 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_130 = vec3(0.0, 0.0, 0.0);
            diffuse_131 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_132 = (color_132 + (diffuse_131 + specular_130));
        toLight_129 = (vec3(20.0, 20.0, 0.0) - tmpvar_19);
        vec3 tmpvar_271;
        tmpvar_271 = normalize(toLight_129);
        toLight_129 = tmpvar_271;
        diffintensity_128 = clamp (dot (tmpvar_12, tmpvar_271), 0.0, 1.0);
        vec3 tmpvar_272;
        Material tmpvar_273;
        if ((tmpvar_17 == 0)) {
          tmpvar_273 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_273 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_273 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_273 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_273 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_273 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_273 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_273 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_273 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_273 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_273 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_273 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_273 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_273 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_273 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        tmpvar_272 = tmpvar_273.spec;
        float tmpvar_274;
        tmpvar_274 = clamp (dot (tmpvar_271, refDir_133), 0.0, 1.0);
        Material tmpvar_275;
        if ((tmpvar_17 == 0)) {
          tmpvar_275 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_275 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_275 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_275 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_275 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_275 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_275 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_275 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_275 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_275 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_275 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_275 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_275 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_275 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_275 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        specular_130 = clamp ((tmpvar_272 * pow (tmpvar_274, tmpvar_275.pow)), 0.0, 1.0);
        Material tmpvar_276;
        if ((tmpvar_17 == 0)) {
          tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
        } else {
          if ((tmpvar_17 == 1)) {
            tmpvar_276 = Material(vec3(0.0, 0.2, 0.0), vec3(0.0, 0.4, 0.0), vec3(0.8, 0.8, 0.8), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
          } else {
            if ((tmpvar_17 == 2)) {
              tmpvar_276 = Material(vec3(0.0, 0.0, 0.2), vec3(0.0, 0.0, 0.4), vec3(0.0, 0.0, 0.0), 50.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
            } else {
              if ((tmpvar_17 == 3)) {
                tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
              } else {
                if ((tmpvar_17 == 4)) {
                  tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                } else {
                  if ((tmpvar_17 == 5)) {
                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                  } else {
                    if ((tmpvar_17 == 6)) {
                      tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.8, 0.5, 0.8), vec3(0.9, 0.9, 0.9), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                    } else {
                      if ((tmpvar_17 == 7)) {
                        tmpvar_276 = Material(vec3(0.2, 0.0, 0.0), vec3(0.5, 0.0, 0.0), vec3(0.8, 0.8, 0.8), 66.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                      } else {
                        if ((tmpvar_17 == 8)) {
                          tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.62, 0.555802, 0.366065), 51.2, bool(0), bool(1), vec3(0.93806, 0.846365, 0.391481), 1.0);
                        } else {
                          if ((tmpvar_17 == 9)) {
                            tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 70.0, bool(1), bool(1), vec3(0.04, 0.04, 0.04), 1.5);
                          } else {
                            if (((tmpvar_17 >= 10) && (tmpvar_17 < 10))) {
                              tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                            } else {
                              if (((tmpvar_17 == 10) || (tmpvar_17 == 11))) {
                                tmpvar_276 = Material(vec3(0.0, 0.0, 0.0), vec3(0.01, 0.01, 0.01), vec3(0.8, 0.8, 0.8), 120.0, bool(0), bool(1), vec3(0.9691, 0.90355, 0.952236), 1.0);
                              } else {
                                if ((tmpvar_17 == 12)) {
                                  tmpvar_276 = Material(vec3(0.25, 0.25, 0.25), vec3(0.3, 0.34, 0.36), vec3(0.8, 0.8, 0.8), 60.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                } else {
                                  if ((tmpvar_17 > 13)) {
                                    tmpvar_276 = Material(vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), 20.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  } else {
                                    tmpvar_276 = Material(vec3(1.0, 0.95, 0.85), vec3(0.0, 0.0, 0.0), vec3(0.0, 0.0, 0.0), 30.0, bool(0), bool(0), vec3(0.0, 0.0, 0.0), 1.0);
                                  };
                                };
                              };
                            };
                          };
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
        diffuse_131 = clamp ((tmpvar_276.dif * diffintensity_128), 0.0, 1.0);
        if (isShadowOn) {
          vec3 tmpvar_277;
          vec3 tmpvar_278;
          tmpvar_277 = (tmpvar_19 + (tmpvar_12 * 0.001));
          tmpvar_278 = normalize((vec3(20.0, 20.0, 0.0) - tmpvar_19));
          int tmpvar_279;
          tmpvar_279 = tmpvar_17;
          int i_280;
          float minT_281;
          minT_281 = -1.0;
          i_280 = 0;
          while (true) {
            if ((i_280 >= 10)) {
              break;
            };
            vec4 sphere_282;
            sphere_282 = spheres[i_280];
            int tmpvar_283;
            float tmpvar_284;
            bool tmpvar_285;
            float t_286;
            float t2_287;
            float t1_288;
            vec3 tmpvar_289;
            tmpvar_289 = (tmpvar_277 - sphere_282.xyz);
            float tmpvar_290;
            tmpvar_290 = (dot (tmpvar_289, tmpvar_278) * 2.0);
            float tmpvar_291;
            tmpvar_291 = dot (tmpvar_278, tmpvar_278);
            float tmpvar_292;
            tmpvar_292 = ((tmpvar_290 * tmpvar_290) - ((4.0 * tmpvar_291) * (
              dot (tmpvar_289, tmpvar_289)
             - 
              (sphere_282.w * sphere_282.w)
            )));
            if ((tmpvar_292 < 0.0)) {
              tmpvar_285 = bool(0);
            } else {
              float tmpvar_293;
              tmpvar_293 = sqrt(tmpvar_292);
              float tmpvar_294;
              tmpvar_294 = (((
                -(tmpvar_290)
               + tmpvar_293) / 2.0) / tmpvar_291);
              t1_288 = tmpvar_294;
              float tmpvar_295;
              tmpvar_295 = (((
                -(tmpvar_290)
               - tmpvar_293) / 2.0) / tmpvar_291);
              t2_287 = tmpvar_295;
              if ((tmpvar_294 < 0.001)) {
                t1_288 = -0.001;
              };
              if ((tmpvar_295 < 0.001)) {
                t2_287 = -0.001;
              };
              if ((t1_288 < 0.0)) {
                tmpvar_285 = bool(0);
              } else {
                if ((t2_287 > 0.0)) {
                  t_286 = t2_287;
                } else {
                  t_286 = t1_288;
                };
                tmpvar_283 = i_280;
                tmpvar_284 = t_286;
                tmpvar_285 = bool(1);
              };
            };
            if ((tmpvar_285 && ((tmpvar_284 < minT_281) || (minT_281 < 0.0)))) {
              minT_281 = tmpvar_284;
              tmpvar_279 = tmpvar_283;
            };
            i_280++;
          };
          float tmpvar_296;
          bool tmpvar_297;
          float t1_298;
          float v_299;
          float u_300;
          float invDet_301;
          vec3 T_302;
          vec3 tmpvar_303;
          tmpvar_303 = ((tmpvar_278.yzx * vec3(2.0, 28.0, -19.0)) - (tmpvar_278.zxy * vec3(-19.0, 2.0, 28.0)));
          invDet_301 = (1.0/(dot (vec3(0.0, -19.0, 2.0), tmpvar_303)));
          T_302 = (tmpvar_277 - vec3(-14.0, 14.0, -14.0));
          u_300 = (dot (T_302, tmpvar_303) * invDet_301);
          if (((u_300 < 0.0) || (u_300 > 1.0))) {
            tmpvar_297 = bool(0);
          } else {
            vec3 tmpvar_304;
            tmpvar_304 = ((T_302.yzx * vec3(2.0, 0.0, -19.0)) - (T_302.zxy * vec3(-19.0, 2.0, 0.0)));
            v_299 = (dot (tmpvar_278, tmpvar_304) * invDet_301);
            if (((v_299 < 0.0) || ((u_300 + v_299) > 1.0))) {
              tmpvar_297 = bool(0);
            } else {
              t1_298 = (dot (vec3(28.0, -19.0, 2.0), tmpvar_304) * invDet_301);
              if ((t1_298 > 0.001)) {
                tmpvar_296 = t1_298;
                tmpvar_297 = bool(1);
              } else {
                tmpvar_297 = bool(0);
              };
            };
          };
          if ((tmpvar_297 && ((tmpvar_296 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_296;
            tmpvar_279 = 10;
          };
          float tmpvar_305;
          bool tmpvar_306;
          float t1_307;
          float v_308;
          float u_309;
          float invDet_310;
          vec3 T_311;
          vec3 tmpvar_312;
          tmpvar_312 = ((tmpvar_278.yzx * vec3(0.0, 28.0, 0.0)) - (tmpvar_278.zxy * vec3(0.0, 0.0, 28.0)));
          invDet_310 = (1.0/(dot (vec3(28.0, -19.0, 2.0), tmpvar_312)));
          T_311 = (tmpvar_277 - vec3(-14.0, 14.0, -14.0));
          u_309 = (dot (T_311, tmpvar_312) * invDet_310);
          if (((u_309 < 0.0) || (u_309 > 1.0))) {
            tmpvar_306 = bool(0);
          } else {
            vec3 tmpvar_313;
            tmpvar_313 = ((T_311.yzx * vec3(2.0, 28.0, -19.0)) - (T_311.zxy * vec3(-19.0, 2.0, 28.0)));
            v_308 = (dot (tmpvar_278, tmpvar_313) * invDet_310);
            if (((v_308 < 0.0) || ((u_309 + v_308) > 1.0))) {
              tmpvar_306 = bool(0);
            } else {
              t1_307 = (dot (vec3(28.0, 0.0, 0.0), tmpvar_313) * invDet_310);
              if ((t1_307 > 0.001)) {
                tmpvar_305 = t1_307;
                tmpvar_306 = bool(1);
              } else {
                tmpvar_306 = bool(0);
              };
            };
          };
          if ((tmpvar_306 && ((tmpvar_305 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_305;
            tmpvar_279 = 11;
          };
          bool tmpvar_314;
          float tmpvar_315;
          bool tmpvar_316;
          float tmpvar_317;
          tmpvar_317 = ((vec3(0.0, -10.0, 0.0) - tmpvar_277).y / tmpvar_278.y);
          if ((tmpvar_317 < 0.001)) {
            tmpvar_316 = bool(0);
          } else {
            tmpvar_315 = tmpvar_317;
            tmpvar_316 = bool(1);
          };
          if (tmpvar_316) {
            vec3 tmpvar_318;
            tmpvar_318 = ((tmpvar_277 + (tmpvar_315 * tmpvar_278)) - vec3(0.0, -10.0, 0.0));
            float tmpvar_319;
            tmpvar_319 = sqrt(dot (tmpvar_318, tmpvar_318));
            if ((tmpvar_319 > 30.0)) {
              tmpvar_314 = bool(0);
            } else {
              tmpvar_314 = bool(1);
            };
          } else {
            tmpvar_314 = bool(0);
          };
          if ((tmpvar_314 && ((tmpvar_315 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_315;
            tmpvar_279 = 12;
          };
          float tmpvar_320;
          bool tmpvar_321;
          float tmpvar_322;
          tmpvar_322 = (dot (vec3(0.0, 0.0, -1.0), (vec3(0.0, 0.0, 10000.0) - tmpvar_277)) / dot (vec3(0.0, 0.0, -1.0), tmpvar_278));
          if ((tmpvar_322 < 0.001)) {
            tmpvar_321 = bool(0);
          } else {
            tmpvar_320 = tmpvar_322;
            tmpvar_321 = bool(1);
          };
          if ((tmpvar_321 && ((tmpvar_320 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_320;
            tmpvar_279 = 14;
          };
          float tmpvar_323;
          bool tmpvar_324;
          float tmpvar_325;
          tmpvar_325 = ((vec3(0.0, -10000.0, 0.0) - tmpvar_277).y / tmpvar_278.y);
          if ((tmpvar_325 < 0.001)) {
            tmpvar_324 = bool(0);
          } else {
            tmpvar_323 = tmpvar_325;
            tmpvar_324 = bool(1);
          };
          if ((tmpvar_324 && ((tmpvar_323 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_323;
            tmpvar_279 = 15;
          };
          float tmpvar_326;
          bool tmpvar_327;
          float tmpvar_328;
          tmpvar_328 = ((vec3(0.0, 0.0, -10000.0) - tmpvar_277).z / tmpvar_278.z);
          if ((tmpvar_328 < 0.001)) {
            tmpvar_327 = bool(0);
          } else {
            tmpvar_326 = tmpvar_328;
            tmpvar_327 = bool(1);
          };
          if ((tmpvar_327 && ((tmpvar_326 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_326;
            tmpvar_279 = 16;
          };
          float tmpvar_329;
          bool tmpvar_330;
          float tmpvar_331;
          tmpvar_331 = ((vec3(-10000.0, 0.0, 0.0) - tmpvar_277).x / tmpvar_278.x);
          if ((tmpvar_331 < 0.001)) {
            tmpvar_330 = bool(0);
          } else {
            tmpvar_329 = tmpvar_331;
            tmpvar_330 = bool(1);
          };
          if ((tmpvar_330 && ((tmpvar_329 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_329;
            tmpvar_279 = 17;
          };
          float tmpvar_332;
          bool tmpvar_333;
          float tmpvar_334;
          tmpvar_334 = (dot (vec3(-1.0, 0.0, 0.0), (vec3(10000.0, 0.0, 0.0) - tmpvar_277)) / dot (vec3(-1.0, 0.0, 0.0), tmpvar_278));
          if ((tmpvar_334 < 0.001)) {
            tmpvar_333 = bool(0);
          } else {
            tmpvar_332 = tmpvar_334;
            tmpvar_333 = bool(1);
          };
          if ((tmpvar_333 && ((tmpvar_332 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_332;
            tmpvar_279 = 18;
          };
          float tmpvar_335;
          bool tmpvar_336;
          float tmpvar_337;
          tmpvar_337 = (dot (vec3(0.0, -1.0, 0.0), (vec3(0.0, 10000.0, 0.0) - tmpvar_277)) / dot (vec3(0.0, -1.0, 0.0), tmpvar_278));
          if ((tmpvar_337 < 0.001)) {
            tmpvar_336 = bool(0);
          } else {
            tmpvar_335 = tmpvar_337;
            tmpvar_336 = bool(1);
          };
          if ((tmpvar_336 && ((tmpvar_335 < minT_281) || (minT_281 < 0.0)))) {
            minT_281 = tmpvar_335;
            tmpvar_279 = 19;
          };
          if ((((
            (((tmpvar_279 != 0) && (tmpvar_279 != 5)) && (tmpvar_279 != 6))
           && 
            (tmpvar_279 != 12)
          ) && (tmpvar_279 != tmpvar_17)) && (tmpvar_17 <= 12))) {
            specular_130 = vec3(0.0, 0.0, 0.0);
            diffuse_131 = vec3(0.0, 0.0, 0.0);
          };
        };
        color_132 = (color_132 + (diffuse_131 + specular_130));
        tmpvar_127 = color_132;
      };
      color_14 = (color_14 + (tmpvar_127 * coeff_3));
      if ((tmpvar_17 == 0)) {
        float tmpvar_338;
        tmpvar_338 = (time / 5.0);
        u_8 = (u_8 + tmpvar_338);
        v_7 = (v_7 + tmpvar_338);
        vec2 tmpvar_339;
        tmpvar_339.x = u_8;
        tmpvar_339.y = v_7;
        color_14 = (color_14 * (texture2D (sunTexture, tmpvar_339).xyz + vec3(0.0, 0.0, 0.5)));
      } else {
        if ((tmpvar_17 == 3)) {
          if (!(useNormalMap)) {
            u_8 = (u_8 + (time / 2.0));
          };
          vec2 tmpvar_340;
          tmpvar_340.x = u_8;
          tmpvar_340.y = v_7;
          color_14 = (color_14 * texture2D (earthTexture, tmpvar_340).xyz);
        } else {
          if ((tmpvar_17 == 4)) {
            if (!(useNormalMap)) {
              u_8 = (u_8 + (time / 7.0));
            };
            vec2 tmpvar_341;
            tmpvar_341.x = u_8;
            tmpvar_341.y = v_7;
            color_14 = (color_14 * texture2D (moonTexture, tmpvar_341).xyz);
          } else {
            if ((tmpvar_17 == 12)) {
              color_14 = (color_14 * texture2D (groundTexture, (0.15 * tmpvar_19.xz)).xyz);
            } else {
              if ((tmpvar_17 == 14)) {
                color_14 = (color_14 * texture2D (skyboxTextureBack, ((
                  -(tmpvar_19.xy)
                 + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
              } else {
                if ((tmpvar_17 == 15)) {
                  color_14 = (color_14 * texture2D (skyboxTextureDown, ((tmpvar_19.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                } else {
                  if ((tmpvar_17 == 16)) {
                    color_14 = (color_14 * texture2D (skyboxTextureFront, ((
                      (tmpvar_19.xy * vec2(1.0, -1.0))
                     + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                  } else {
                    if ((tmpvar_17 == 17)) {
                      color_14 = (color_14 * texture2D (skyboxTextureLeft, ((tmpvar_19.yz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                    } else {
                      if ((tmpvar_17 == 18)) {
                        color_14 = (color_14 * texture2D (skyboxTextureRight, ((
                          (tmpvar_19.zy * vec2(1.0, -1.0))
                         + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                      } else {
                        if ((tmpvar_17 == 19)) {
                          color_14 = (color_14 * texture2D (skyboxTextureUp, ((tmpvar_19.xz + vec2(10000.0, 10000.0)) / 20000.0)).xyz);
                        };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      bool tmpvar_342;
      tmpvar_342 = (((tmpvar_17 == 3) && (color_14.z > color_14.x)) && (color_14.z > color_14.y));
      if ((((tmpvar_123 || tmpvar_122) || tmpvar_342) && (bounceCount_4 <= depth))) {
        bool totalInternalReflection_343;
        totalInternalReflection_343 = bool(0);
        if (tmpvar_122) {
          Ray refractedRay_344;
          float tmpvar_345;
          tmpvar_345 = (1.0/(tmpvar_125));
          float tmpvar_346;
          tmpvar_346 = dot (ray_1.dir, tmpvar_12);
          vec3 tmpvar_347;
          if ((tmpvar_346 <= 0.0)) {
            vec3 I_348;
            I_348 = ray_1.dir;
            vec3 tmpvar_349;
            float tmpvar_350;
            tmpvar_350 = dot (tmpvar_12, I_348);
            float tmpvar_351;
            tmpvar_351 = (1.0 - (tmpvar_345 * (tmpvar_345 * 
              (1.0 - (tmpvar_350 * tmpvar_350))
            )));
            if ((tmpvar_351 < 0.0)) {
              tmpvar_349 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_349 = ((tmpvar_345 * I_348) - ((
                (tmpvar_345 * tmpvar_350)
               + 
                sqrt(tmpvar_351)
              ) * tmpvar_12));
            };
            tmpvar_347 = tmpvar_349;
          } else {
            vec3 I_352;
            I_352 = ray_1.dir;
            vec3 N_353;
            N_353 = -(tmpvar_12);
            float eta_354;
            eta_354 = (1.0/(tmpvar_345));
            vec3 tmpvar_355;
            float tmpvar_356;
            tmpvar_356 = dot (N_353, I_352);
            float tmpvar_357;
            tmpvar_357 = (1.0 - (eta_354 * (eta_354 * 
              (1.0 - (tmpvar_356 * tmpvar_356))
            )));
            if ((tmpvar_357 < 0.0)) {
              tmpvar_355 = vec3(0.0, 0.0, 0.0);
            } else {
              tmpvar_355 = ((eta_354 * I_352) - ((
                (eta_354 * tmpvar_356)
               + 
                sqrt(tmpvar_357)
              ) * N_353));
            };
            tmpvar_347 = tmpvar_355;
          };
          refractedRay_344.dir = tmpvar_347;
          vec3 x_358;
          x_358 = refractedRay_344.dir;
          totalInternalReflection_343 = (sqrt(dot (x_358, x_358)) < 0.001);
          if (totalInternalReflection_343) {
            vec3 I_359;
            I_359 = ray_1.dir;
            vec3 N_360;
            N_360 = -(tmpvar_12);
            ray_1.dir = normalize((I_359 - (2.0 * 
              (dot (N_360, I_359) * N_360)
            )));
            ray_1.origin = (tmpvar_19 - (tmpvar_12 * 0.001));
          } else {
            refractedRay_344.origin = (tmpvar_19 + ((tmpvar_12 * 0.001) * sign(
              dot (ray_1.dir, tmpvar_12)
            )));
            refractedRay_344.dir = normalize(refractedRay_344.dir);
            if (!(tmpvar_123)) {
              ray_1 = refractedRay_344;
            } else {
              stack_6[stackSize_5].coeff = (coeff_3 * (vec3(1.0, 1.0, 1.0) - (tmpvar_124 + 
                ((vec3(1.0, 1.0, 1.0) - tmpvar_124) * pow ((1.0 - abs(
                  dot (tmpvar_12, ray_1.dir)
                )), 5.0))
              )));
              stack_6[stackSize_5].depth = bounceCount_4;
              int tmpvar_361;
              tmpvar_361 = stackSize_5;
              stackSize_5++;
              stack_6[tmpvar_361].ray = refractedRay_344;
            };
          };
        };
        if ((((tmpvar_123 && 
          !(totalInternalReflection_343)
        ) && (tmpvar_17 != 3)) || tmpvar_342)) {
          float tmpvar_362;
          tmpvar_362 = dot (ray_1.dir, tmpvar_12);
          if ((tmpvar_362 < 0.0)) {
            coeff_3 = (coeff_3 * (tmpvar_124 + (
              (vec3(1.0, 1.0, 1.0) - tmpvar_124)
             * 
              pow ((1.0 - abs(dot (tmpvar_12, ray_1.dir))), 5.0)
            )));
            vec3 I_363;
            I_363 = ray_1.dir;
            ray_1.dir = normalize((I_363 - (2.0 * 
              (dot (tmpvar_12, I_363) * tmpvar_12)
            )));
            ray_1.origin = (tmpvar_19 + (tmpvar_12 * 0.001));
          } else {
            continueLoop_2 = bool(0);
          };
        };
      } else {
        continueLoop_2 = bool(0);
      };
    } else {
      color_14 = (color_14 + (vec3(0.6, 0.75, 0.9) * coeff_3));
      continueLoop_2 = bool(0);
    };
    if (isGlowOn) {
      vec3 glowness_364;
      vec3 tmpvar_365;
      tmpvar_365 = normalize(ray_1.dir);
      vec3 tmpvar_366;
      tmpvar_366 = (ray_1.origin + (abs(
        dot ((spheres[0].xyz - ray_1.origin), tmpvar_365)
      ) * tmpvar_365));
      float tmpvar_367;
      tmpvar_367 = sqrt(dot (tmpvar_366, tmpvar_366));
      float tmpvar_368;
      vec3 x_369;
      x_369 = (tmpvar_19 - eye);
      tmpvar_368 = sqrt(dot (x_369, x_369));
      float tmpvar_370;
      vec3 x_371;
      x_371 = (spheres[0].xyz - eye);
      tmpvar_370 = sqrt(dot (x_371, x_371));
      if (((tmpvar_368 + spheres[0].w) < tmpvar_370)) {
        glowness_364 = vec3(0.0, 0.0, 0.0);
      } else {
        glowness_364 = (vec3(1.0, 0.95, 0.1) * clamp ((2.0 / 
          (0.5 + (tmpvar_367 * tmpvar_367))
        ), 0.0, 1.0));
      };
      color_14 = (color_14 + glowness_364);
    };
    if ((!(continueLoop_2) && (stackSize_5 > 0))) {
      int tmpvar_372;
      tmpvar_372 = (stackSize_5 - 1);
      stackSize_5 = tmpvar_372;
      ray_1 = stack_6[tmpvar_372].ray;
      bounceCount_4 = stack_6[tmpvar_372].depth;
      coeff_3 = stack_6[tmpvar_372].coeff;
      continueLoop_2 = bool(1);
    };
  };
  vec4 tmpvar_373;
  tmpvar_373.w = 1.0;
  tmpvar_373.x = color_14[colorModeInTernary[0]];
  tmpvar_373.y = color_14[colorModeInTernary[1]];
  tmpvar_373.z = color_14[colorModeInTernary[2]];
  gl_FragColor = tmpvar_373;
}