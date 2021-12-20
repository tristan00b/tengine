#version 300 es

layout (std140) uniform Matrix {
  mat4 view;
  mat4 projection;
} m;

uniform mat4 model_matrix;

in  vec3 in_vertex_position;
in  vec3 in_vertex_normal;
out vec3 pass_vertex_position;
out vec3 pass_vertex_normal;

void main()
{
  mat4 modelView = m.view * model_matrix;
  vec4 position = modelView * vec4(in_vertex_position, 1.0);
  vec4 normal   = modelView * vec4(in_vertex_normal,   0.0);

  pass_vertex_position = vec3(position);
  pass_vertex_normal   = vec3(normal);

  gl_Position = m.projection * position;
}
