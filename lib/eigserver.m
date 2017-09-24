function eigserver = server(port)

if (nargin < 1)
    port = 8080;
end

addpath('./nucompres/resources;./nucompres/lib;./nucompres/support/json');
javaaddpath('./nucompres/lib');

% Cast port to number in case this is called from the command line.
if (ischar(port)), port = str2double(port); end;

    function response = init(req)
        %% partition data to features and tag for training data
        rsize = size(req.data, 2);
        dimSize = sqrt(rsize);
        arr = zeros(dimSize, dimSize);
        
        for col = 1:dimSize
            values = req.data((col - 1) * dimSize + 1: col * dimSize);
            arr(:, col) = values;
        end
        
        [v, d] = eig(arr);
        response = v;
    end

routingTable = {};
routingTable{end+1} = {'POST /eig', @init};

nuserver = NuServer(port, routingTable);

fprintf(1, 'Listening on http://localhost:%d\n', port);

% Note: This call will block in case of Standalone Application or Octave!
nuserver.start();

end
