#include <stdio.h>
#include <string.h>
#include <signal.h>
#include "emokit/emokit.h"

int quit;

struct emokit_device *d;

void close()
{
    printf("closing...\n");

    quit = 1;

    emokit_close(d);
    emokit_delete(d);
}

void cleanup(int i)
{
    fprintf(stdout, "Shutting down\n");
    close();

    exit(i);
}

int connect()
{
    signal(SIGINT, cleanup);

    quit = 0;

    d = emokit_create();
    int count = emokit_get_count(d, EMOKIT_VID, EMOKIT_PID);
    printf("Current epoc devices connected: %d\n", count);

    int r = emokit_open(d, EMOKIT_VID, EMOKIT_PID, 1);
    if (r != 0)
    {
        emokit_close(d);
        emokit_delete(d);
        d = emokit_create();
        r = emokit_open(d, EMOKIT_VID, EMOKIT_PID, 0);
        if (r != 0)
        {
            printf("CANNOT CONNECT: %d\n", r);
            return 1;
        }
    }
    printf("Connected to headset.\n");

    r = emokit_read_data_timeout(d, 1000);

    if (r <= 0)
    {
        if (r < 0)
            fprintf(stderr, "Error reading from headset\n");
        else
            fprintf(stderr, "Headset Timeout...\n");
        emokit_close(d);
        emokit_delete(d);
        return 1;
    }

    return 0;
}

emokit_frame get_frame()
{
    struct emokit_frame c;

    if (quit == 1)
        return c;

    int err = emokit_read_data_timeout(d, 1000);
    if (err > 0)
    {
        c = emokit_get_next_frame(d);
    }
    else if (err == 0)
    {
        fprintf(stderr, "Headset Timeout...\n");
    }

    return c;
}
