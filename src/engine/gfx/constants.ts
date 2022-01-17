/* Primitive Types -------------------------------------------------------------------------------------------------- */

export const POINTS                                                  = 0x0000
export const LINES                                                   = 0x0001
export const LINE_LOOP                                               = 0x0002
export const LINE_STRIP                                              = 0x0003
export const TRIANGLES                                               = 0x0004
export const TRIANGLE_STRIP                                          = 0x0005
export const TRIANGLE_FAN                                            = 0x0006


/* Data Types ------------------------------------------------------------------------------------------------------- */

export const BYTE                                                    = 0x1400
export const UNSIGNED_BYTE                                           = 0x1401
export const SHORT                                                   = 0x1402
export const UNSIGNED_SHORT                                          = 0x1403
export const INT                                                     = 0x1404
export const UNSIGNED_INT                                            = 0x1405
export const FLOAT                                                   = 0x1406
export const FLOAT_MAT2x3                                            = 0x8B65
export const FLOAT_MAT2x4                                            = 0x8B66
export const FLOAT_MAT3x2                                            = 0x8B67
export const FLOAT_MAT3x4                                            = 0x8B68
export const FLOAT_MAT4x2                                            = 0x8B69
export const FLOAT_MAT4x3                                            = 0x8B6A
export const UNSIGNED_INT_VEC2                                       = 0x8DC6
export const UNSIGNED_INT_VEC3                                       = 0x8DC7
export const UNSIGNED_INT_VEC4                                       = 0x8DC8
export const UNSIGNED_NORMALIZED                                     = 0x8C17
export const SIGNED_NORMALIZED                                       = 0x8F9C


/* Uniform Types ---------------------------------------------------------------------------------------------------- */

export const FLOAT_VEC2                                              = 0x8B50
export const FLOAT_VEC3                                              = 0x8B51
export const FLOAT_VEC4                                              = 0x8B52
export const INT_VEC2                                                = 0x8B53
export const INT_VEC3                                                = 0x8B54
export const INT_VEC4                                                = 0x8B55
export const BOOL                                                    = 0x8B56
export const BOOL_VEC2                                               = 0x8B57
export const BOOL_VEC3                                               = 0x8B58
export const BOOL_VEC4                                               = 0x8B59
export const FLOAT_MAT2                                              = 0x8B5A
export const FLOAT_MAT3                                              = 0x8B5B
export const FLOAT_MAT4                                              = 0x8B5C
export const SAMPLER_2D                                              = 0x8B5E
export const SAMPLER_CUBE                                            = 0x8B60


/* Faces ------------------------------------------------------------------------------------------------------------ */

export const CULL_FACE                                               = 0x0B44
export const FRONT                                                   = 0x0404
export const BACK                                                    = 0x0405
export const FRONT_AND_BACK                                          = 0x0408
export const CW                                                      = 0x0900
export const CCW                                                     = 0x0901


/* Framebuffers & Renderbuffers ------------------------------------------------------------------------------------- */

export const FRAMEBUFFER                                             = 0x8D40
export const RENDERBUFFER                                            = 0x8D41
export const RGBA4                                                   = 0x8056
export const RGB5_A1                                                 = 0x8057
export const RGB565                                                  = 0x8D62
export const DEPTH_COMPONENT16                                       = 0x81A5
export const STENCIL_INDEX8                                          = 0x8D48
export const DEPTH_STENCIL                                           = 0x84F9
export const RENDERBUFFER_WIDTH                                      = 0x8D42
export const RENDERBUFFER_HEIGHT                                     = 0x8D43
export const RENDERBUFFER_INTERNAL_FORMAT                            = 0x8D44
export const RENDERBUFFER_RED_SIZE                                   = 0x8D50
export const RENDERBUFFER_GREEN_SIZE                                 = 0x8D51
export const RENDERBUFFER_BLUE_SIZE                                  = 0x8D52
export const RENDERBUFFER_ALPHA_SIZE                                 = 0x8D53
export const RENDERBUFFER_DEPTH_SIZE                                 = 0x8D54
export const RENDERBUFFER_STENCIL_SIZE                               = 0x8D55
export const FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE                      = 0x8CD0
export const FRAMEBUFFER_ATTACHMENT_OBJECT_NAME                      = 0x8CD1
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL                    = 0x8CD2
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE            = 0x8CD3
export const COLOR_ATTACHMENT0                                       = 0x8CE0
export const DEPTH_ATTACHMENT                                        = 0x8D00
export const STENCIL_ATTACHMENT                                      = 0x8D20
export const DEPTH_STENCIL_ATTACHMENT                                = 0x821A
export const NONE                                                    = 0
export const FRAMEBUFFER_COMPLETE                                    = 0x8CD5
export const FRAMEBUFFER_INCOMPLETE_ATTACHMENT                       = 0x8CD6
export const FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT               = 0x8CD7
export const FRAMEBUFFER_INCOMPLETE_DIMENSIONS                       = 0x8CD9
export const FRAMEBUFFER_UNSUPPORTED                                 = 0x8CDD
export const FRAMEBUFFER_BINDING                                     = 0x8CA6
export const RENDERBUFFER_BINDING                                    = 0x8CA7
export const MAX_RENDERBUFFER_SIZE                                   = 0x84E8
export const INVALID_FRAMEBUFFER_OPERATION                           = 0x0506
export const FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING                   = 0x8210
export const FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE                   = 0x8211
export const FRAMEBUFFER_ATTACHMENT_RED_SIZE                         = 0x8212
export const FRAMEBUFFER_ATTACHMENT_GREEN_SIZE                       = 0x8213
export const FRAMEBUFFER_ATTACHMENT_BLUE_SIZE                        = 0x8214
export const FRAMEBUFFER_ATTACHMENT_ALPHA_SIZE                       = 0x8215
export const FRAMEBUFFER_ATTACHMENT_DEPTH_SIZE                       = 0x8216
export const FRAMEBUFFER_ATTACHMENT_STENCIL_SIZE                     = 0x8217
export const FRAMEBUFFER_DEFAULT                                     = 0x8218
export const DEPTH24_STENCIL8                                        = 0x88F0
export const DRAW_FRAMEBUFFER_BINDING                                = 0x8CA6
export const READ_FRAMEBUFFER                                        = 0x8CA8
export const DRAW_FRAMEBUFFER                                        = 0x8CA9
export const READ_FRAMEBUFFER_BINDING                                = 0x8CAA
export const RENDERBUFFER_SAMPLES                                    = 0x8CAB
export const FRAMEBUFFER_ATTACHMENT_TEXTURE_LAYER                    = 0x8CD4
export const FRAMEBUFFER_INCOMPLETE_MULTISAMPLE                      = 0x8D56


/* Shaders ---------------------------------------------------------------------------------------------------------- */

export const FRAGMENT_SHADER                                         = 0x8B30
export const VERTEX_SHADER                                           = 0x8B31
export const COMPILE_STATUS                                          = 0x8B81
export const DELETE_STATUS                                           = 0x8B80
export const LINK_STATUS                                             = 0x8B82
export const VALIDATE_STATUS                                         = 0x8B83
export const ATTACHED_SHADERS                                        = 0x8B85
export const ACTIVE_ATTRIBUTES                                       = 0x8B89
export const ACTIVE_UNIFORMS                                         = 0x8B86
export const MAX_VERTEX_ATTRIBS                                      = 0x8869
export const MAX_VERTEX_UNIFORM_VECTORS                              = 0x8DFB
export const MAX_VARYING_VECTORS                                     = 0x8DFC
export const MAX_COMBINED_TEXTURE_IMAGE_UNITS                        = 0x8B4D
export const MAX_VERTEX_TEXTURE_IMAGE_UNITS                          = 0x8B4C
export const MAX_TEXTURE_IMAGE_UNITS                                 = 0x8872
export const MAX_FRAGMENT_UNIFORM_VECTORS                            = 0x8DFD
export const SHADER_TYPE                                             = 0x8B4F
export const SHADING_LANGUAGE_VERSION                                = 0x8B8C
export const CURRENT_PROGRAM                                         = 0x8B8D


/* Errors ----------------------------------------------------------------------------------------------------------- */

export const NO_ERROR                                                = 0
export const INVALID_ENUM                                            = 0x0500
export const INVALID_VALUE                                           = 0x0501
export const INVALID_OPERATION                                       = 0x0502
export const OUT_OF_MEMORY                                           = 0x0505
export const CONTEXT_LOST_WEBGL                                      = 0x9242
