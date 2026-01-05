import Layout from "../../../components/layout/Layout";
import NoticeTable from "./components/NoticeTable";

const NoticePage = () => {
  return (
    <Layout>
      <div className="p-6">
        <NoticeTable />
      </div>
    </Layout>
  );
};

export default NoticePage;
