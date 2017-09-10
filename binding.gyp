{
  "targets": [
    {
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
        "lib/emokit-c/include",
        "/usr/local/include"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")"
      ],
      "target_name": "emotiv",
      "sources": [
        "lib/bindings.cc",
        "lib/emokit-c/src/emokit.c",
      ],
      "libraries": [
        "/usr/local/lib/libhidapi.0.dylib",
        "/usr/local/lib/libmcrypt.4.4.8.dylib"
      ],
      "defines": [
        "EXTERNAL_API"
      ],
      "cflags!": [
        "-fno-exceptions"
      ],
      "cflags_cc!": [
        "-fno-exceptions"
      ],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.7",
        "OTHER_LDFLAGS": [
          "-framework IOKit"
        ]
      },
      "msvs_settings": {
        "VCCLCompilerTool": {
          "ExceptionHandling": 1
        }
      }
    }
  ]
}
