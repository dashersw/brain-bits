/*

Modified example from https://staging.gitlab.com/jbergstroem/node.js/blob/f49dd21b2f9ba6688a3d678dc1dd8b2894d2eb49/test/addons-napi/test_async/test_async.cc

*/

#include "napi.h"
#include <assert.h>
#include "emotiv.cc"

#define MAX_CANCEL_THREADS 6

typedef struct
{
    int32_t _input;
    emokit_frame _output;
    napi_ref _callback;
    napi_async_work _request;
} carrier;

carrier the_carrier;
carrier async_carrier[MAX_CANCEL_THREADS];

void Execute(napi_env env, void *data)
{
    carrier *c = static_cast<carrier *>(data);

    if (c != &the_carrier)
    {
        napi_throw_type_error(env, "400", "Wrong data parameter to Execute.");
        return;
    }

    c->_output = get_frame();
}

napi_value constructRetVal(napi_env env, emokit_frame f)
{
    napi_status status;

    napi_value rv, levels, cq, gyro, battery, counter, gyroX, gyroY,
        F3, FC6, P7, T8, F7, F8, T7, P8, AF4, F4, AF3, O2, O1, FC5,
        cq_F3, cq_FC6, cq_P7, cq_T8, cq_F7, cq_F8, cq_T7, cq_P8, cq_AF4, cq_F4, cq_AF3, cq_O2, cq_O1, cq_FC5;

    status = napi_create_object(env, &rv);
    assert(status == napi_ok);

    status = napi_create_int32(env, f.battery, &battery);
    assert(status == napi_ok);

    status = napi_set_named_property(env, rv, "battery", battery);
    assert(status == napi_ok);

    status = napi_create_int32(env, f.counter, &counter);
    assert(status == napi_ok);

    status = napi_set_named_property(env, rv, "counter", counter);
    assert(status == napi_ok);

    status = napi_create_int32(env, f.battery, &battery);
    assert(status == napi_ok);

    status = napi_set_named_property(env, rv, "battery", battery);
    assert(status == napi_ok);

    /*

        Create levels object

    */
    napi_create_object(env, &levels);

    napi_create_int32(env, f.F3, &F3);
    napi_create_int32(env, f.FC6, &FC6);
    napi_create_int32(env, f.P7, &P7);
    napi_create_int32(env, f.T8, &T8);
    napi_create_int32(env, f.F7, &F7);
    napi_create_int32(env, f.F8, &F8);
    napi_create_int32(env, f.T7, &T7);
    napi_create_int32(env, f.P8, &P8);
    napi_create_int32(env, f.AF4, &AF4);
    napi_create_int32(env, f.F4, &F4);
    napi_create_int32(env, f.AF3, &AF3);
    napi_create_int32(env, f.O2, &O2);
    napi_create_int32(env, f.O1, &O1);
    napi_create_int32(env, f.FC5, &FC5);

    napi_set_named_property(env, levels, "F3", F3);
    napi_set_named_property(env, levels, "FC6", FC6);
    napi_set_named_property(env, levels, "P7", P7);
    napi_set_named_property(env, levels, "T8", T8);
    napi_set_named_property(env, levels, "F7", F7);
    napi_set_named_property(env, levels, "F8", F8);
    napi_set_named_property(env, levels, "T7", T7);
    napi_set_named_property(env, levels, "P8", P8);
    napi_set_named_property(env, levels, "AF4", AF4);
    napi_set_named_property(env, levels, "F4", F4);
    napi_set_named_property(env, levels, "AF3", AF3);
    napi_set_named_property(env, levels, "O2", O2);
    napi_set_named_property(env, levels, "O1", O1);
    napi_set_named_property(env, levels, "FC5", FC5);

    /*

        Create contact quality object

    */
    napi_create_object(env, &cq);

    napi_create_int32(env, f.cq.F3, &cq_F3);
    napi_create_int32(env, f.cq.FC6, &cq_FC6);
    napi_create_int32(env, f.cq.P7, &cq_P7);
    napi_create_int32(env, f.cq.T8, &cq_T8);
    napi_create_int32(env, f.cq.F7, &cq_F7);
    napi_create_int32(env, f.cq.F8, &cq_F8);
    napi_create_int32(env, f.cq.T7, &cq_T7);
    napi_create_int32(env, f.cq.P8, &cq_P8);
    napi_create_int32(env, f.cq.AF4, &cq_AF4);
    napi_create_int32(env, f.cq.F4, &cq_F4);
    napi_create_int32(env, f.cq.AF3, &cq_AF3);
    napi_create_int32(env, f.cq.O2, &cq_O2);
    napi_create_int32(env, f.cq.O1, &cq_O1);
    napi_create_int32(env, f.cq.FC5, &cq_FC5);

    napi_set_named_property(env, cq, "F3", cq_F3);
    napi_set_named_property(env, cq, "FC6", cq_FC6);
    napi_set_named_property(env, cq, "P7", cq_P7);
    napi_set_named_property(env, cq, "T8", cq_T8);
    napi_set_named_property(env, cq, "F7", cq_F7);
    napi_set_named_property(env, cq, "F8", cq_F8);
    napi_set_named_property(env, cq, "T7", cq_T7);
    napi_set_named_property(env, cq, "P8", cq_P8);
    napi_set_named_property(env, cq, "AF4", cq_AF4);
    napi_set_named_property(env, cq, "F4", cq_F4);
    napi_set_named_property(env, cq, "AF3", cq_AF3);
    napi_set_named_property(env, cq, "O2", cq_O2);
    napi_set_named_property(env, cq, "O1", cq_O1);
    napi_set_named_property(env, cq, "FC5", cq_FC5);

    /*

        Create gyro object

    */
    napi_create_object(env, &gyro);

    napi_create_int32(env, f.gyroX, &gyroX);
    napi_create_int32(env, f.gyroY, &gyroY);
    napi_set_named_property(env, gyro, "x", gyroX);
    napi_set_named_property(env, gyro, "y", gyroY);

    /*

        set levels, cq and gyro objects in rv

    */
    napi_set_named_property(env, rv, "levels", levels);
    napi_set_named_property(env, rv, "cq", cq);
    napi_set_named_property(env, rv, "gyro", gyro);

    return rv;
}

void Complete(napi_env env, napi_status status, void *data)
{
    napi_status s;

    carrier *c = static_cast<carrier *>(data);

    if (c != &the_carrier)
    {
        napi_throw_type_error(env, "400", "Wrong data parameter to Complete.");
        return;
    }

    if (status != napi_ok)
    {
        napi_throw_type_error(env, "400", "Execute callback failed.");
        return;
    }

    napi_value argv[2];

    s = napi_get_null(env, &argv[0]);
    assert(s == napi_ok);

    argv[1] = constructRetVal(env, c->_output);

    napi_value callback;
    s = napi_get_reference_value(env, c->_callback, &callback);
    assert(s == napi_ok);
    napi_value global;
    s = napi_get_global(env, &global);
    assert(s == napi_ok);

    napi_value result;
    s = napi_make_callback(env, NULL, global, callback, 2, argv, &result);
    assert(s == napi_ok);

    // napi_delete_reference(env, c->_callback);
    // napi_delete_async_work(env, c->_request);
}

void BusyCancelComplete(napi_env env, napi_status status, void *data)
{
    carrier *c = static_cast<carrier *>(data);
    napi_delete_async_work(env, c->_request);
}

napi_value read(napi_env env, napi_callback_info info)
{
    napi_status status;

    size_t argc = 1;
    napi_value argv[1];
    napi_value _this;
    void *data;

    status = napi_get_cb_info(env, info, &argc, argv, &_this, &data);
    assert(status == napi_ok);

    status = napi_create_reference(env, argv[0], 1, &the_carrier._callback);
    assert(status == napi_ok);

    napi_value title;
    napi_create_string_utf8(env, "emotiv::read", NAPI_AUTO_LENGTH, &title);

    status = napi_create_async_work(env, NULL, title, Execute, Complete, &the_carrier, &the_carrier._request);
    assert(status == napi_ok);
    status = napi_queue_async_work(env, the_carrier._request);
    assert(status == napi_ok);

    return nullptr;
}

napi_value disconnect(napi_env env, napi_callback_info info)
{
    close();
    return nullptr;
}

void CancelComplete(napi_env env, napi_status status, void *data)
{
    napi_status s;

    carrier *c = static_cast<carrier *>(data);

    if (status == napi_cancelled)
    {
        // ok we got the status we expected so make the callback to
        // indicate the cancel succeeded.
        napi_value callback;
        s = napi_get_reference_value(env, c->_callback, &callback);
        assert(s == napi_ok);
        napi_value global;
        s = napi_get_global(env, &global);
        assert(s == napi_ok);
        napi_value result;

        s = napi_make_callback(env, NULL, global, callback, 0, nullptr, &result);
        assert(s == napi_ok);
    }

    s = napi_delete_async_work(env, c->_request);
    assert(s == napi_ok);
    s = napi_delete_reference(env, c->_callback);
    assert(s == napi_ok);
}

#define DECLARE_NAPI_PROPERTY(name, func)           \
    {                                               \
        (name), 0, (func), 0, 0, 0, napi_default, 0 \
    }

napi_value _connect(napi_env env, napi_callback_info info)
{
    napi_value connection;
    int rv = connect();
    napi_create_int32(env, rv, &connection);

    return connection;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_status status;

    napi_property_descriptor properties[] = {
        DECLARE_NAPI_PROPERTY("read", read),
        DECLARE_NAPI_PROPERTY("connect", _connect),
        DECLARE_NAPI_PROPERTY("disconnect", disconnect),
    };

    status = napi_define_properties(env, exports, sizeof(properties) / sizeof(*properties), properties);

    assert(status == napi_ok);
    return exports;
}

NAPI_MODULE(addon, Init)
