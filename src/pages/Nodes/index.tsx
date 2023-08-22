import { useQueryParams, StringParam } from "use-query-params";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet";

import FilterMenu from "../../components/FilterMenu";
import NodeList from "../../components/NodeList";

import { useMachineTypes } from "../../lib/paddles";

export default function Nodes() {
  const [params, setParams] = useQueryParams({
    machine_type: StringParam,
  });
  const { machine_type } = params;
  
  return (
    <div>
      <Helmet>
        <title>Nodes - Pulpito</title>
      </Helmet>
      <Typography variant="h5" style={{ margin: "20px" }}>
        Nodes
      </Typography>
      <div style={{ height: "auto", display: "flex" }}>
        <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "auto" }}>
          <div>
            <Typography style={{ padding: "10px" }}>
              Filter&nbsp;by:
            </Typography>
          </div>   
          <FilterMenu
            type="machine_type"
            value={machine_type}
            setter={setParams}
            optionsHook={useMachineTypes}
            width={150}
          />
        </div>
      </div>
      <NodeList params={params} setter={setParams} />
    </div>
  );
}
