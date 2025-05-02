using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChungChiChuyenGia
{
    public class Gets
    {
        public class  Query: IRequest<Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>>
        {
            public int? MaChuyenGia;
        }
        public class Handler : IRequestHandler<Query, Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>>
        {
            private readonly IConfiguration _configuration;
            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>> Handle(Query request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaChuyenGia", request.MaChuyenGia);
                        var result = await connection.QueryAsync<DLK_ChungChiChuyenGia_TepKemTheo>("SP_Gets_ChungChiChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        if (result.Count() > 0)
                        {
                            foreach (var item in result)
                            {

                                var tepKemTheo = await connection.QueryAsync<DLK_TepDinhKem>("SP_Get_TepDinhKemByMaDoiTuong", new { MaDoiTuong = item.MaChungChi }, commandType: System.Data.CommandType.StoredProcedure);
                                item.TepKemTheo = tepKemTheo.ToList();
                            }
                        }
                        return Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>.Success(result);
                    }
                    catch (Exception ex)
                    {
                        return Result<IEnumerable<DLK_ChungChiChuyenGia_TepKemTheo>>.Failure(ex.Message);
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}
